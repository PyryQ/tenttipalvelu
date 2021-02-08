using System;
using Npgsql;

namespace Version
{
    class Program
    {
        static void Main(string[] args)
        {
            var cs = "Host=localhost;Username=postgres;Password=MnoP1994;Database=Tenttikanta";

            using var con = new NpgsqlConnection(cs);
            con.Open();

            var sql = "SELECT version()";

            using var cmd = new NpgsqlCommand(sql, con);

            var version = cmd.ExecuteScalar().ToString();
            Console.WriteLine($"");
            Console.WriteLine($"PostgreSQL version: {version}");

            Console.WriteLine($"");
            Console.WriteLine($"SELECT * FROM tentti");
            //Select tentti
            string sqlSelect = "SELECT * FROM tentti";
            using var cmdSelect = new NpgsqlCommand(sqlSelect, con);

            using NpgsqlDataReader rdr = cmdSelect.ExecuteReader();

            // while (rdr.Read())
            // {
            //     Console.WriteLine("Indeksi: {0} Tentin nimi: {1} Pistemäärä: {2}", rdr.GetInt32(0), rdr.GetString(1),
            //             rdr.GetInt32(2));
            // }


            Console.WriteLine($"");
            Console.WriteLine($"Taulukon sarakkeiden nimet");

            Console.WriteLine($"{rdr.GetName(0),-4} {rdr.GetName(1),-10} {rdr.GetName(2),10} {rdr.GetName(3),10} {rdr.GetName(4),10} {rdr.GetName(5),10}");

            while (rdr.Read())
            {
                Console.WriteLine($"{rdr.GetInt32(0),-4} {rdr.GetString(1),-10} {rdr.GetInt32(2),10}");
            }




            // Console.WriteLine($"");
            // Console.WriteLine($"INSERT INTO tentti");
            // var sqlInsert = "INSERT INTO tentti(nimi, tenttipisteet) VALUES(@nimi, @tenttipisteet)";
            // using var cmdInsert = new NpgsqlCommand(sqlInsert, con);

            // cmdInsert.Parameters.AddWithValue("nimi", "Esimerkkitentti");
            // cmdInsert.Parameters.AddWithValue("tenttipisteet", 35);
            // cmdInsert.Prepare();

            // cmdInsert.ExecuteNonQuery();

            // Console.WriteLine("tentti listätty");
        



        }
    }
}    
