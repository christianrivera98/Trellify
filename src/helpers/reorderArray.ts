export const reorderArray = <T>(array: T[], fromIndex: number, toIndex: number): T[] => {
    const updatedArray = [...array];
    const [movedItem] = updatedArray.splice(fromIndex, 1);
    updatedArray.splice(toIndex, 0, movedItem);
    return updatedArray;
  };