# Security Specification - SPI Master Archives

## Data Invariants
1. A user can only read and write their own `UserStats`, `UserVault`, and `UserSettings`.
2. `UserStats.xp`, `level`, `coins`, and `streak` are numeric and must be non-negative.
3. `UserVault` data is private.
4. `PublicProfile` is readable by all authenticated users but only writable by the owner or system.
5. Leaderboard entries are derived from `PublicProfile` data.
6. `CachedLesson` content is private to the user who synthesized it.
7. `createdAt` and `updatedAt` timestamps must be validated against `request.time`.

## The Dirty Dozen Payloads

1. **Identity Spoofing**: Attempt to create a `users/{someone_else_id}` document.
2. **Resource Poisoning**: Injection of a 2MB string into `CachedLesson.script`.
3. **Privilege Escalation**: Attempt to set `isAdmin: true` on a user document (even though not currently implemented, good to test).
4. **Invalid Type Injection**: Sending a string for `UserStats.xp`.
5. **Orphaned Writes**: Creating a `lessons/{lessonId}` without a parent user document (relational sync).
6. **Self-Assigned Rewards**: Directly updating `UserStats.coins` by a large amount without legitimate progress.
7. **Cross-Tenant Read**: Authenticated User A attempting to `get()` `users/UserB/vault/data`.
8. **Malicious ID**: Using `../` or special characters in `lessonId` to attempt path traversal.
9. **Timestamp Manipulation**: Sending a `2030-01-01` date for `updatedAt`.
10. **Shadow Fields**: Adding `isVerified: true` to a `UserStats` update.
11. **Negative Counters**: Setting `UserStats.streak` to `-50`.
12. **Blanket Read Attack**: Querying `users` collection without a `uid` filter.

## Test Runner (Logic Definitions)

The following tests will be implemented in `firestore.rules.test.ts` to verify these protections.

```typescript
// Example test cases (conceptual)
it('forbids cross-user reads', async () => {
  const db = authedApp({ uid: 'userA' });
  await firebase.assertFails(db.doc('users/userB').get());
});

it('enforces strict schema on user stats', async () => {
  const db = authedApp({ uid: 'userA' });
  await firebase.assertFails(db.doc('users/userA').set({ xp: 'lots' }));
});
```
