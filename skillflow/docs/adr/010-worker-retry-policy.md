# ADR-010 — Politique de retry par tâche et réponse d'échec du Worker

**Date :** 2026-07-26
**Statut :** Accepté

## Contexte

Le Worker traite deux types de tâches asynchrones aux profils très différents :

- `QUIZ_CORRECTION` : calcul pur, déterministe, sans dépendance externe. Un échec
  signifie systématiquement une entrée invalide (payload malformé).
- `CERTIFICATE_GENERATION` : génération de PDF + envoi SMTP. Dépend de systèmes
  externes qui peuvent connaître des pannes transitoires.

Initialement, toute erreur déclenchait un `nack()` et le retry était délégué
uniquement à la politique de la souscription Pub/Sub, identique pour toutes les
tâches. Deux problèmes :

1. Un payload malformé (erreur définitive) était rejoué en boucle jusqu'à la DLQ.
2. En cas d'échec, **le Backend n'était jamais informé** — il restait en attente
   d'une réponse qui n'arrivait pas, ce qui viole l'exigence « fournir une réponse
   (même en cas d'échec) au Backend via une autre Queue ».

## Décision

Le Worker porte désormais la **responsabilité de la criticité et du retry**, par tâche :

- Une table `RETRY_POLICIES` associe à chaque type de tâche `{ maxAttempts, retryable }`.
  - `QUIZ_CORRECTION` : `{ maxAttempts: 1, retryable: false }` (échec = donnée invalide).
  - `CERTIFICATE_GENERATION` : `{ maxAttempts: 5, retryable: true }` (pannes transitoires tolérées).
- Une erreur `PermanentTaskError` (payload invalide) n'est **jamais** rejouée.
- Classification à l'exécution :
  - **Permanente** ou **retryable=false** → `publishResponse(status: 'failure')` puis `ack()`.
  - **Transitoire, tentatives restantes** → `nack()` (redelivery avec backoff Pub/Sub).
  - **Transitoire, tentatives épuisées** → `publishResponse(status: 'failure')` puis `ack()`.
- L'enveloppe de réponse gagne un champ `status: 'success' | 'failure'` et un `error`.
  Le Backend (`WorkerResponseSubscriber`) traite explicitement les échecs.

## Conséquences

**Positif**
- Le Backend reçoit toujours une réponse, succès comme échec (bout-en-bout observable).
- Pas de rejeu inutile des erreurs définitives → moins de charge et de bruit en DLQ.
- La criticité est décidée dans le code métier du Worker, testable unitairement.

**Négatif**
- Le contrat de message de réponse évolue (ajout de `status`) : le Backend doit être
  tolérant aux anciens messages sans `status` (traités comme succès par défaut).
- La politique de retry est en dur dans le Worker ; un ajustement nécessite un déploiement.
