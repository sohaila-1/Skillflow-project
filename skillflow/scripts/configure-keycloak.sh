#!/bin/bash
# Run this script once after `docker compose up` to configure the skillflow Keycloak realm.
# It enables forgot-password, TOTP, email login, and wires up Mailhog for email testing.
#
# Usage:
#   cd skillflow
#   bash scripts/configure-keycloak.sh
#
# Or against a remote Keycloak:
#   KEYCLOAK_URL=https://auth.example.com bash scripts/configure-keycloak.sh

set -euo pipefail

KEYCLOAK_URL="${KEYCLOAK_URL:-http://localhost:8080}"
REALM="${KEYCLOAK_REALM:-skillflow}"
ADMIN_USER="${KEYCLOAK_ADMIN:-admin}"
ADMIN_PASS="${KEYCLOAK_ADMIN_PASSWORD:-admin}"

echo "=> Waiting for Keycloak at $KEYCLOAK_URL ..."
until curl -sf "$KEYCLOAK_URL/health/ready" > /dev/null 2>&1; do
  printf "."
  sleep 2
done
echo ""
echo "=> Keycloak is ready."

# ─── 1. Get admin token ─────────────────────────────────────────────────────
TOKEN=$(curl -sf -X POST \
  "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" \
  -d "grant_type=password&client_id=admin-cli&username=$ADMIN_USER&password=$ADMIN_PASS" \
  | jq -r '.access_token')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "ERROR: failed to obtain admin token. Check ADMIN_USER / ADMIN_PASS."
  exit 1
fi
echo "=> Admin token obtained."

# ─── 2. Update realm settings ───────────────────────────────────────────────
# resetPasswordAllowed  → enables "Forgot password?" on Keycloak login screen
# loginWithEmailAllowed → allows login with email address
# otpPolicy*            → TOTP settings compatible with Aegis / Google Authenticator
# smtpServer            → routes email through Mailhog (web UI at http://localhost:8025)
curl -sf -X PUT "$KEYCLOAK_URL/admin/realms/$REALM" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resetPasswordAllowed": true,
    "loginWithEmailAllowed": true,
    "rememberMe": true,
    "verifyEmail": false,
    "otpPolicyType": "totp",
    "otpPolicyAlgorithm": "HmacSHA1",
    "otpPolicyDigits": 6,
    "otpPolicyPeriod": 30,
    "otpPolicyLookAheadWindow": 1,
    "smtpServer": {
      "host": "mailpit",
      "port": "1025",
      "from": "noreply@skillflow.local",
      "fromDisplayName": "SkillFlow",
      "ssl": "false",
      "starttls": "false",
      "auth": "false"
    }
  }' && echo "=> Realm settings updated." || echo "WARNING: realm update returned an error (realm may not exist yet)"

# ─── 3. Enable required actions ─────────────────────────────────────────────
# CONFIGURE_TOTP → lets users set up 2FA from their account console
# UPDATE_PASSWORD → used when password reset email is triggered
for ACTION in CONFIGURE_TOTP UPDATE_PASSWORD VERIFY_EMAIL; do
  curl -sf -X PUT "$KEYCLOAK_URL/admin/realms/$REALM/authentication/required-actions/$ACTION" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"alias\": \"$ACTION\", \"enabled\": true, \"defaultAction\": false}" \
    && echo "   ✓ Required action $ACTION enabled" \
    || echo "   ! Could not update $ACTION (may already be correct)"
done

echo ""
echo "Done. Keycloak realm '$REALM' is configured:"
echo "  ✓ Forgot password (resetPasswordAllowed)"
echo "  ✓ Login with email"
echo "  ✓ TOTP policy (SHA1 / 6 digits / 30s — compatible with Aegis & Google Authenticator)"
echo "  ✓ SMTP → Mailpit (view captured emails at http://localhost:8025)"
echo ""
echo "Users can manage 2FA at:"
echo "  $KEYCLOAK_URL/realms/$REALM/account/#/security/signingin"
