export const theoryPartKey = (materialId: string, taskId: string): string =>
  `theory/topics/${materialId}/${taskId}.pdf`;

export const questionBankPartKey = (
  materialId: string,
  taskId: string
): string => `qbank/topics/${materialId}/${taskId}.pdf`;

export const mergedMaterialKey = (type: string, materialId: string): string =>
  `merged/${type}/${materialId}.pdf`;
