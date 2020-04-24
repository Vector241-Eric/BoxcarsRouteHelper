using System;
using System.IO;
using System.Linq;
using System.Text;
using LinqToExcel;
using NUnit.Framework;

namespace JavascriptDataGenerator
{
    [TestFixture]
    public class PayoutDataGenerator
    {
        [Test]
        public void Generate()
        {
            var inputFile = GeneratorFileHelper.GetInputExcelFile();

            var excel = new ExcelQueryFactory(inputFile);
            var rows = (from c in excel.WorksheetNoHeader("UK-Payouts")
                        select c).ToArray();

            var counter = 1;
            foreach (RowNoHeader r in rows)
            {
                Console.WriteLine("Row [" + counter + "]: " + r[0]);
                counter = counter + 1;
            }

            //Skip the first row (header)
            //Skip the last row (totals)

            Console.WriteLine("Rows length: " + rows.Length);

            rows = rows.Take(rows.Length).Skip(1).ToArray();

            Console.WriteLine("Input row length: " + rows.Length);

            var outputFile = GeneratorFileHelper.InitializeOutputJsFile("Payouts_UK.js");
            var builder = new StringBuilder();
            builder.AppendLine();
            builder.AppendLine("Boxcars.Data.payouts = [");

            for (var inputRowIndex = 0; inputRowIndex < rows.Length; inputRowIndex++)
            {
                var isLastRow = inputRowIndex == rows.Length - 1;
                builder.AppendFormat("//{0}\n\t[", inputRowIndex);

                var row = rows[inputRowIndex];
                Console.WriteLine("Processing row: " + row[0]);

                //Skip the first cell (row header)
                var cells = row.Skip(1).ToArray();
                for (var inputColumnIndex = 0; inputColumnIndex < cells.Length; inputColumnIndex++)
                {
                    var isLastCell = inputColumnIndex == cells.Length - 1;
                    var stringValue = cells[inputColumnIndex].Value.ToString();
                    var decimalValue = decimal.Parse(stringValue)*1000;
                    builder.AppendFormat("\"${0:n0}\"", decimalValue);
                    var separator = string.Empty;
                    var makeNewLine = (inputColumnIndex%10) == 9 && (!isLastCell);
                    if (makeNewLine)
                        separator = ",\n\t";
                    else if (!isLastCell)
                        separator = ",";
                    builder.Append(separator);
                }
                builder.AppendLine(isLastRow ? "]" : "],");
            }
            builder.AppendLine("];");

            File.AppendAllText(outputFile, builder.ToString());
        }
    }
}