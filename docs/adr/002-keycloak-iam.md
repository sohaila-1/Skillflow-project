# ADR-002 — Choix de Keycloak comme service IAM

**Date :** 2025-09-01  
**Statut :** Accepté

## Contexte

Le projet nécessite un système d'IAM gérant : création de compte, connexion, reset de mot de passe, MFA (TOTP), et suppression du MFA.

## Décision

Utilisation de **Keycloak 24** auto-hébergé (Docker en dev, Cloud Run ou VM en prod).

Raisons :
- Open-source, mature, battle-tested
- Gestion native du MFA (TOTP compatible Aegis)
- Admin API complète pour l'administration programmatique
- Support des standards OIDC/OAuth2
- Screens de connexion prêts à l'emploi (hors scope évaluation design)

## Conséquences

- ✅ Toutes les contraintes IAM couvertes nativement
- ✅ Tokens JWT validables par le backend sans appel réseau (signature publique)
- ⚠️ Ressource mémoire conséquente (~512 MB) — à prévoir dans l'infra
- ⚠️ Config initiale (realm, clients) à scripter pour reproductibilité
