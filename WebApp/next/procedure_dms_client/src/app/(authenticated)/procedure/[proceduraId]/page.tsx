export default function Procedura({ params } : { params: { proceduraId: string } }) {
    return (
        <div className="flex justify-center items-center h-screen bg-blue-300">
            Loading...{params.proceduraId}
        </div>
    );
}