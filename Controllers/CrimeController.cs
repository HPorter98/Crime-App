using System;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.Data.SqlClient;
using Geolocation;
using System.Net;
using System.Net.Http;

namespace Crime_App.Controllers;

[ApiController]
[Route("[controller]")]
public class CrimeController : ControllerBase
{
    private readonly ILogger<CrimeController> _logger;

    const string connectionString = "Data Source= DESKTOP-OC5DHKK; Initial Catalog=Crime;Integrated Security=True; Encrypt=False";

    public CrimeController(ILogger<CrimeController> logger)
    {
        _logger = logger;
    }

    private CrimeStat CreateCrimeRecord(SqlDataReader reader)
    {
        return new CrimeStat {
            crimeID = (string)reader["Crime_ID"],
            month = (string)reader["Month"],
            reportedBy = (string)reader["Reported_by"],
            fallsWithin = (string)reader["Falls_within"],
            longitude = (decimal)reader["Longitude"],
            latitude = (decimal)reader["Latitude"],
            location = (string)reader["Crime_Location"],
            lsoaCode = (string)reader["LSOA_code"],
            lsoaName = (string)reader["LSOA_name"],
            crimeType = (string)reader["Crime_type"],
            lastOutcomeCategory = (string)reader["Last_outcome_category"]
        };
    }

    private double KilometresToMiles(double km) {
        return km * 0.61237;
    }

    private void PrintErrorToConsole(Microsoft.Data.SqlClient.SqlException ex) {
        _logger.LogError("Error Code: " + ex.Number);
        _logger.LogError("Error Message: " + ex.Message);
        System.Console.WriteLine("Database Read Failed");
    }

    [HttpGet]
    public IActionResult Get(string lng, string lat, string radius)
    {
        double radiusInMiles = KilometresToMiles(Convert.ToDouble(radius));
        Console.WriteLine("GET " + lng + " " + lat);
        CoordinateBoundaries boundaries = new CoordinateBoundaries(Convert.ToDouble(lat), Convert.ToDouble(lng), radiusInMiles);

        Console.WriteLine("Max Lat: " + boundaries.MaxLatitude.ToString());
        Console.WriteLine("Max Lng: " + boundaries.MaxLongitude.ToString());

        Console.WriteLine("Min Lat: " + boundaries.MinLatitude.ToString());
        Console.WriteLine("Min Lng: " + boundaries.MinLongitude.ToString());

        List<CrimeStat> _crimes = new List<CrimeStat>();
        try
        {
            string query = @"SELECT * FROM CrimeStats WHERE Latitude 
                            BETWEEN @minLat AND @maxLat 
                            AND Longitude BETWEEN @minLong AND @maxLong";               
            
            
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand(query, connection))
                {
                    cmd.Parameters.Add(new SqlParameter("@minLat", boundaries.MinLatitude.ToString()));
                    cmd.Parameters.Add(new SqlParameter("@maxLat", boundaries.MaxLatitude.ToString()));
                    cmd.Parameters.Add(new SqlParameter("@minLong", boundaries.MinLongitude.ToString()));
                    cmd.Parameters.Add(new SqlParameter("@maxLong", boundaries.MaxLongitude.ToString()));
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            _crimes.Add(CreateCrimeRecord(reader));
                        }

                        string json = JsonConvert.SerializeObject(new {
                            crimes = _crimes
                        });
                        
                        Response.ContentType = "application/json";
                        return Ok(json);
                    }
                }
            }
        }
        catch (Microsoft.Data.SqlClient.SqlException ex)
        {
            
            PrintErrorToConsole(ex);
            return BadRequest();
            //HttpStatusCode.BadRequest;
        }
    }

    [HttpGet("distinctValues")]
    public IActionResult GetDistinctValues(){
        Console.WriteLine("Hit Distinct");
        try
        {
            string query = "SELECT DISTINCT Crime_type FROM CrimeStats";
            List<string> distinctTypes = new List<string>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand(query, connection))
                {
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Console.WriteLine(reader["Crime_type"]);
                            distinctTypes.Add((string)reader["Crime_type"]);
                        }

                        string json = JsonConvert.SerializeObject(new {
                            types = distinctTypes
                        });

                        return Ok(json);
                    }
                }
            }
        }
        catch (Microsoft.Data.SqlClient.SqlException ex)
        {
            PrintErrorToConsole(ex);
            return BadRequest();
        }
    }


}