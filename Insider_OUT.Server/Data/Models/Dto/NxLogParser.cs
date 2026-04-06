using System;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

namespace Insider_OUT.Server.Data.Models.Dto
{

    /// Normalized NXLog event after parsing and GUID extraction.
    /// This is the DTO used by the rest of the pipeline.

    public class NxLogEvent
    {
        public DateTime EventTime { get; set; }
        public string ClientIP { get; set; }
        public string Request { get; set; }
        public string UserAgent { get; set; }
        public Guid TokenId { get; set; }
    }


    /// Static parser for NXLog JSON lines.
    /// Converts raw JSON into NxLogEvent and extracts the Token GUID.

    public static class NxLogParser
    {
        // Regex to extract GUID from the Request field
        private static readonly Regex GuidRegex =
            new Regex(@"([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})",
                      RegexOptions.Compiled);


        /// Parses a single NXLog JSON line.
        /// Returns null if the line is invalid, not a GET request, or contains no GUID.

        public static NxLogEvent? ParseLine(string jsonLine)
        {
            if (string.IsNullOrWhiteSpace(jsonLine))
                return null;

            NxLogRaw? raw;
            try
            {
                raw = JsonSerializer.Deserialize<NxLogRaw>(jsonLine);
            }
            catch
            {
                return null; // invalid JSON
            }

            if (raw == null)
                return null;

            // Only process GET requests
            if (raw.Request == null || !raw.Request.StartsWith("GET", StringComparison.OrdinalIgnoreCase))
                return null;

            // Extract GUID from the Request path
            var match = GuidRegex.Match(raw.Request);
            if (!match.Success)
                return null;

            if (!Guid.TryParse(match.Value, out Guid tokenId))
                return null;

            // Parse timestamp: "30/Mar/2026:13:16:34 -0400"
            if (!DateTime.TryParseExact(
                    raw.EventTime,
                    "dd/MMM/yyyy:HH:mm:ss zzz",
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.None,
                    out DateTime parsedTime))
            {
                return null;
            }

            return new NxLogEvent
            {
                EventTime = parsedTime,
                ClientIP = raw.ClientIP ?? "",
                Request = raw.Request ?? "",
                UserAgent = raw.UserAgent ?? "",
                TokenId = tokenId
            };
        }


        /// Internal raw model matching NXLog JSON exactly.

        private class NxLogRaw
        {
            [JsonPropertyName("EventTime")]
            public string EventTime { get; set; }

            [JsonPropertyName("ClientIP")]
            public string ClientIP { get; set; }

            [JsonPropertyName("Request")]
            public string Request { get; set; }

            [JsonPropertyName("UserAgent")]
            public string UserAgent { get; set; }
        }
    }
}