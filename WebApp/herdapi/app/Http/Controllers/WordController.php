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
        $table3->addCell(9000, array('shading' => array('fill' => 'D3D3D3')))->addText('SVRHA PROCEDURE', array('bold' => true));
        $table3->addRow();
        $table3->addCell(9000)->addText($document->description);

        // Assuming $version->document_data is a JSON object like {"array1": ["item1", "item2"], "array2": ["item3", "item4"]}

        $listStyleName = 'myListStyle';
        $phpWord->addNumberingStyle(
            $listStyleName,
            array('type' => 'multilevel', 'levels' => array(
                array('format' => 'decimal', 'text' => '%1.', 'left' => 360, 'hanging' => 360, 'tabPos' => 360)
            ))
        );

        $listNumber = 1;

        $noBorderStyle = array('borderTopSize' => 0, 'borderTopColor' => 'FFFFFF','borderBottomSize' => 0, 'borderBottomColor' => 'FFFFFF', 'cellMargin' => 80);


        // Assuming $version->document_data is a JSON object like {"array1": ["item1", "item2"], "array2": ["item3", "item4"]}
        $documentData = $version->document_data;
        if ($documentData && is_array($documentData)) {
            foreach ($documentData as $key => $values) {
                $formattedKey = strtoupper(str_replace('_', ' ', $key));

                // Add a new row for the array name
                $table3->addRow();
                $table3->addCell(9000, array('shading' => array('fill' => 'D3D3D3')))->addText($formattedKey, array('bold' => true));

                if (is_array($values)) {
                    foreach ($values as $value) {
                        // Add a new row for each value as a list item with manual numbering
                        $table3->addRow();
                        $tableCell = $table3->addCell(9000, $noBorderStyle);
                        $tableCell->addText("{$listNumber}. {$value}");
                        $listNumber++; // Increment the list number
                    }
                }
                // Optionally reset the list number here if you want to start from 1 for each key
                $listNumber = 1;
            }
        }

        $secondSection = $phpWord->addSection(array(
            'marginTop' => 1000,
            'marginBottom' => 2000,
            'marginLeft' => 800,
            'marginRight' => 800
        ));

        $madeByTable = $secondSection->addTable('StyledTable');

        $madeByTable->addRow();
        $madeByTable->addCell(2000)->addText('IZRADIO/LA');
        $madeByTable->addCell(4000)->addText($version->created_by_name);
        $madeByTable->addCell(3000)->addText('');

        $madeByTable->addRow();
        $madeByTable->addCell(2000)->addText('Odobrio/LA');
        $madeByTable->addCell(4000)->addText($version->modified_by_name);
        $madeByTable->addCell(3000)->addText('Datum: ' . $version->created_at);

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
