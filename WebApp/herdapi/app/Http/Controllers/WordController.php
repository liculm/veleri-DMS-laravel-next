<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentVersion;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use PhpOffice\PhpWord\SimpleType\JcTable;

class WordController extends Controller
{
    public function createWordFile(Request $request, $proceduraId, $versionId): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        $version = DocumentVersion::query()
            ->where('id', $versionId)
            ->first();

        $document = Document::query()
            ->where('id', $proceduraId)
            ->first();

        $phpWord = new PhpWord();

        $phpWord->setDefaultFontName('Tahoma');
        $phpWord->setDefaultFontSize(8);

        $section = $phpWord->addSection(array(
            'marginTop' => 1000,
            'marginBottom' => 2000,
            'marginLeft' => 800,
            'marginRight' => 800
        ));

        $section->addText('VELEUČILIŠTE U RIJECI', array('size' => 14, 'bold' => true), array('align' => 'center'));

        $tableStyle = array(
            'borderSize' => 6,
            'borderColor' => '000000',
            'cellMargin' => 50,
            'alignment' => JcTable::CENTER,
        );

        $cellStyle = array('valign' => 'center');

        $phpWord->addTableStyle('StyledTable', $tableStyle);

        $firstTable = $section->addTable('StyledTable');

        $firstTable->addRow();
        $firstTable->addCell(3000, $cellStyle)->addText('NAZIV PROCEDURE', array('bold' => true));
        $firstTable->addCell(6000, $cellStyle)->addText($document->name, array('bold' => true, 'underline' => 'single'));

        $firstTable->addRow();
        $firstTable->addCell(3000)->addText('ORGANIZACIJSKA JEDINICA/PROCES/LOKACIJA');
        $firstTable->addCell(6000)->addText('NASTAVNA DJELATNOST');

        $firstTable->addRow();
        $firstTable->addCell(2000)->addText('ŠIFRA PROCEDURE');
        $firstTable->addCell(7000)->addText('ND-1');

        $secondTable = $section->addTable('StyledTable');

        $secondTable->addRow();
        $secondTable->addCell(2000)->addText('ODGOVORNE OSOBE');
        $secondTable->addCell(4000)->addText('NOSITELJI KOLEGIJA, PROČELNICI ODJELA/VODITELJI STUDIJA, GOSTUJUĆI PREDAVAČ, PRODEKAN ZA NASTAVU, RUKOVODITELJ ODJELA U PODRUČNOJ SLUŽBI: TAJNIK, DEKAN, ODJEL ZA RAČUNOVODSTVENE POSLOVE');
        $secondTable->addCell(1000)->addText('DATUM PRIMJENE');
        $secondTable->addCell(2000)->addText('Ak. godina ' . $version->academic_year);

        $secondTable->addRow();
        $secondTable->addCell(2000)->addText('VREMENSKA DINAMIKA');
        $secondTable->addCell(4000)->addText('TIJEKOM ZIMSKOG I LJETNOG SEMESTRA AKADEMSKE GODINE');
        $secondTable->addCell(1000)->addText('MEĐUOVISNOSTI');
        $secondTable->addCell(2000)->addText('NOSITELJI KOLEGIJA, PROČELNICI ODJELA/VODITELJI STUDIJA KOJI SE IZVODI IZVAN ODJELA, GOST PREDAVAČ, PRODEKAN ZA NASTAVU, RUKOVODITELJ ODJELA U PODRUČNOJ SLUŽBI: TAJNIK, ODJEL ZA RAČUNOVODSTVENE POSLOVE, KOORDINATOR ZA NASTAVU');

        $table3 = $section->addTable('StyledTable');

        $table3->addRow();
        $table3->addCell(9000)->addText('');
        $table3->addRow();
        $table3->addCell(9000)->addText('SVRHA PROCEDURE', array('bold' => true), array('backgroundColor' => '808080'));
        $table3->addRow();
        $table3->addCell(9000)->addText($document->description);

        $table3->addRow();
        $table3->addCell(9000)->addText('OPIS PROCESA');
        $table3->addRow();
        $table3->addCell(9000)->addText($document->description);

        // Use an in-memory file stream to generate the document
        $xmlWriter = IOFactory::createWriter($phpWord);
        $tempFile = tempnam(sys_get_temp_dir(), 'PHPWord');
        $xmlWriter->save($tempFile);

        // Return the file as a download response
        return response()->download($tempFile, $document->name . '.docx')->deleteFileAfterSend();



//        // Define the file name and path to save the document
//        $fileName = 'Procedura_za_gostujuca_predavanja.docx';
//        $filePath = "D:\\Dump\\" . $fileName; // Use an absolute path directly
//
//// Save the file locally
//        $phpWord->save($filePath, 'Word2007');
//        return response()->json(['message' => "Creating word file for proceduraId: $proceduraId and versionId: $versionId"]);
    }
}