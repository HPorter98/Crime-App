namespace CrimeTest;

[TestClass]
public class UnitTest1
{
    private readonly ILogger<Crime_App.Controllers.CrimeController> _logger;
    [TestMethod]
    public void TestMethod1()
    {
        var controller = new Crime_App.Controllers.CrimeController(_logger);
        var response = controller.Get("-2.5859957179320077", "51.41541326811594", "1");
        Console.WriteLine(response);
        Assert.IsNull(response);
    }

    [TestMethod]
    public void TestMethod2(){
        var controller = new Crime_App.Controllers.CrimeController(_logger);
        var response = (OkObjectResult)controller.GetDistinctValues();
        var x = response.Value;
        // string obj = JsonConvert.DeserializeObject((OkObjectResult)response);

        Console.WriteLine("x");
        Assert.IsNull(response);
       
    }
}