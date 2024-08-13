export const DocumentVersionStatuses = [
  { id: 4, color: 'bg-green-100', label: 'Odobreno' },
  { id: 3, color: 'bg-yellow-100', label: 'Treba dorada' },
  { id: 2, color: 'bg-red-100', label: 'Odbijeno' },
  { id: 1, color: 'bg-gray-100', label: 'Čekanje' },
]

export function getDocumentVersionStatus(versionStatusId: number): { id: number, color: string, label: string } {
  const status = DocumentVersionStatuses.find(status => status.id === versionStatusId);
  return status ? status : { id: 0, color: '', label: '/' };
}
