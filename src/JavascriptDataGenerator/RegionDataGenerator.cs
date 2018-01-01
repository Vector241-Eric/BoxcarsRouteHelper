using System;
using System.IO;
using System.Linq;
using LinqToExcel;
using NUnit.Framework;

namespace JavascriptDataGenerator
{
    [TestFixture, Ignore]
    public class RegionDataGenerator
    {
        public class RegionRow
        {
            public string OE { get; set; }
            public string Roll { get; set; }
            public string Destination { get; set; }
            public int Index { get; set; }

            public string Key
            {
                get { return string.Format("{0}:{1}", OE, Roll); }
            }

            public string GetElementAdd(string objectName)
            {
                return string.Format("{0}[\"{1}\"] = \"{2}\";", objectName, Key, Destination);
            }
        }

        [Test]
        public void Generate()
        {
            var inputFile = GeneratorFileHelper.GetInputExcelFile();

            var excel = new ExcelQueryFactory(inputFile);
            var rows = from c in excel.Worksheet<RegionRow>("UK-Regions")
                select c;

            var outputFile = GeneratorFileHelper.InitializeOutputJsFile("Regions_UK.js", "regions");
            File.AppendAllLines(outputFile, rows.Select(x => x.GetElementAdd("Boxcars.Data.regions")).ToArray());
        }
    }
}