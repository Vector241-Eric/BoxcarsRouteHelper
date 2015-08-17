using System.IO;
using System.Linq;
using System.Text;
using LinqToExcel;
using NUnit.Framework;

namespace JavascriptDataGenerator
{
    [TestFixture, Ignore]
    public class CityDataGenerator
    {
        [Test]
        public void Generate()
        {
            var inputFile = GeneratorFileHelper.GetInputExcelFile();

            var excel = new ExcelQueryFactory(inputFile);
            var columns = excel.GetColumnNames("Payouts").Skip(1);

            var outputFile = GeneratorFileHelper.InitializeOutputJsFile("Cities.js");
            var builder = new StringBuilder("Boxcars.Data.cities = [\n\t");
            var counter = 0;
            foreach (var column in columns)
            {
                builder.AppendFormat("'{0}', ", column);
                counter = (counter + 1)%5;
                if (counter == 0)
                    builder.Append("\n\t");
            }
            //Remove the last comma and space
            builder.Length -= 2; 
            builder.Append("\n];");
            File.AppendAllText(outputFile, builder.ToString());
        }
    }
}