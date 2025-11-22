export const deleteFactWithAnimation = (
  factId: string,
  setDeletedFactId: (id: string | null) => void,
  onComplete: () => void
) => {
  // Set the fact as being deleted (trigger animation)
  setDeletedFactId(factId);

  // Wait for animation to complete, then actually delete
  setTimeout(() => {
    onComplete();
    setDeletedFactId(null);
  }, 300); // Match this with your CSS animation duration
};