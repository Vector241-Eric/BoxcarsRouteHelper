using System.IO;
using System.Linq;
using LinqToExcel;
using NUnit.Framework;

namespace JavascriptDataGenerator
{
    [TestFixture, Ignore]
    public class DestinationDataGenerator
    {
        public class DestinationRow
        {
            public string Region { get; set; }
            public string OE { get; set; }
            public string Roll { get; set; }
            public string Destination { get; set; }
            public int Index { get; set; }

            public string Key
            {
                get { return string.Format("{0}:{1}:{2}", Region, OE, Roll); }
            }

            public string GetElementAdd(string objectName)
            {
                return string.Format("{0}[\"{1}\"] = {{name: \"{2}\", index: {3}}};", objectName, Key, Destination,
                    Index);
            }
        }

        [Test]
        public void Generate()
        {
            var inputFile = GeneratorFileHelper.GetInputExcelFile();

            var excel = new ExcelQueryFactory(inputFile);
            var rows = from c in excel.Worksheet<DestinationRow>("UK-Destinations")
                select c;

            var outputFile = GeneratorFileHelper.InitializeOutputJsFile("Destinations_UK.js", "destinations");
            File.AppendAllLines(outputFile, rows.Select(x => x.GetElementAdd("Boxcars.Data.destinations")).ToArray());
        }
    }
}