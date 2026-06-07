# ADR-003 — Choix de GCP Pub/Sub comme système de Queue

**Date :** 2025-09-01  
**Statut :** Accepté

## Contexte

Le backend et le worker doivent communiquer de manière asynchrone via deux queues (requests et responses). Le projet sera déployé sur GCP.

## Décision

Utilisation de **GCP Pub/Sub** avec deux topics :
- `worker-requests` : Backend → Worker
- `worker-responses` : Worker → Backend

En développement local : **Pub/Sub Emulator** (Docker).

## Conséquences

- ✅ Natif GCP, intégration simple avec Cloud Run
- ✅ Gratuit jusqu'à 10 GB/mois
- ✅ Émulateur disponible pour le développement local
- ✅ Retry policy configurable au niveau de la subscription
- ⚠️ Vendor lock-in GCP — acceptable car l'infrastructure cible est GCP
