using System.IO;

namespace JavascriptDataGenerator
{
    public static class GeneratorFileHelper
    {
        public static string InitializeOutputJsFile(string fileName, string objectName)
        {
            var filePath = InitializeOutputJsFile(fileName);
            File.AppendAllLines(filePath, new[] {"Boxcars.Data." + objectName + " = {}"});

            return filePath;
        }

        public static string InitializeOutputJsFile(string fileName)
        {
            var baseDirectory = GetBaseDirectory();
            var jsDirectory = Path.Combine(baseDirectory, "src\\BoxcarsRouteHelper\\js");

            var filePath = Path.Combine(jsDirectory, fileName);

            var initializationLines = new[]
            {
                "//  WARNING: Generated Content",
                "//",
                "//  See the JavascriptDataGenerator project",
                string.Empty,
                "var Boxcars = Boxcars || {};",
                "Boxcars.Data = Boxcars.Data || {};",
                string.Empty
            };

            File.WriteAllLines(filePath, initializationLines);

            return filePath;
        }

        public static string GetInputExcelFile()
        {
            var baseDirectory = GetBaseDirectory();
            var dataPath = Path.Combine(baseDirectory, "Data");
            var inputFile = Path.Combine(dataPath, "BoxcarsData.xlsx");
            return inputFile;
        }

        public static string GetBaseDirectory()
        {
            var objectDirectory = Directory.GetCurrentDirectory();
            var baseDirectory = new DirectoryInfo(objectDirectory).Parent.Parent.Parent.Parent.FullName;
            return baseDirectory;
        }
    }
}