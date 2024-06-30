export default function IzmjenaDokumentaPage() {
  return <div className="container mx-auto">
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-xl font-semibold">Trenutna verzija</h2>
      </div>
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-xl font-semibold">Nova verzija</h2>
      </div>
    </div>
  </div>
}