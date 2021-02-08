using System;
using Npgsql;

namespace Version
{
    class Program
    {
        static void Main(string[] args)
        {
            //connectionstring
            var cs = "Host=localhost;Username=postgres;Password=MnoP1994;Database=Tenttikanta";

            using var con = new NpgsqlConnection(cs); //Alustetaan uusi yhteys
            con.Open(); //Avataan yhteys

            var sql = "SELECT version()"; //Sql-kysely

            using var cmd = new NpgsqlCommand(sql, con); //alustetaan kysely

            var version = cmd.ExecuteScalar().ToString(); //Toteutetaan kysely, tallennetaan result muuttujaan
            Console.WriteLine($"");
            Console.WriteLine($"PostgreSQL version: {version}");

            Console.WriteLine($"");
            Console.WriteLine($"SELECT * FROM tentti");

            //Select tentti
            string sqlSelect = "SELECT * FROM tentti"; //alustetaan toinen kysely
            using var cmdSelect = new NpgsqlCommand(sqlSelect, con); //alustetaan kysely

            using NpgsqlDataReader rdr = cmdSelect.ExecuteReader();  //luetaan data

            // while (rdr.Read())
            // {
            //     Console.WriteLine("Indeksi: {0} Tentin nimi: {1} Pistemäärä: {2}", rdr.GetInt32(0), rdr.GetString(1),
            //             rdr.GetInt32(2));
            // }


            Console.WriteLine($"");
            Console.WriteLine($"Taulukon sarakkeiden nimet");

            //Getname palauttaa sarakkeen nimen
            Console.WriteLine($"{rdr.GetName(0),-4} {rdr.GetName(1),-10} {rdr.GetName(2),10} {rdr.GetName(3),10} {rdr.GetName(4),10} {rdr.GetName(5),10}");

            //Käydään taulukko läpi
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
