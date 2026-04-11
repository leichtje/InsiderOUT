using Insider_OUT.Server.Data.Models.Dto;

namespace InsiderOUT.Server.Services
{
    public class NxLogWatcherService : BackgroundService
    {
        private readonly ILogger<NxLogWatcherService> _logger;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly string _watchFolder;

        public NxLogWatcherService(
            ILogger<NxLogWatcherService> logger,
            IServiceScopeFactory scopeFactory,
            IConfiguration config)
        {
            _logger = logger;
            _scopeFactory = scopeFactory;

            _watchFolder = config["NxLog:WatchFolder"]
                ?? throw new Exception("NxLog:WatchFolder not configured.");

            Directory.CreateDirectory(_watchFolder);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("NXLogWatcherService started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ProcessNewFilesAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing NXLog files.");
                }

                await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
            }

            _logger.LogInformation("NXLogWatcherService stopped.");
        }

        private bool IsFileLocked(string file)
        {
            try
            {
                using var stream = File.Open(file, FileMode.Open, FileAccess.Read, FileShare.None);
                return false;
            }
            catch
            {
                return true;
            }
        }

        private async Task ProcessNewFilesAsync()
        {
            var allFiles = Directory.GetFiles(_watchFolder);

            //string[] allFiles;

            //try
            //{
            //    allFiles = Directory.GetFiles(_watchFolder);
            //}
            //catch (IOException)
            //{
            //    _logger.LogDebug("Skipping scan - folder is locked by NXLog.");
            //    return;
            //}

            // -------------------------------------------------------
            // 1. DELETE .log.tmp FILES (ONLY IF UNLOCKED)
            // -------------------------------------------------------
            foreach (var tmp in allFiles.Where(f => f.EndsWith(".log.tmp")))
            {
                if (!IsFileLocked(tmp))
                {
                    File.Delete(tmp);
                    _logger.LogInformation($"Deleted unlocked .log.tmp file: {tmp}");
                }
                else
                {
                    _logger.LogDebug($"Skipping locked .log.tmp file: {tmp}");
                }
            }

            // -------------------------------------------------------
            // 2. PROCESS .log FILES EXACTLY LIKE ORIGINAL
            // -------------------------------------------------------
            var logFiles = Directory.GetFiles(_watchFolder, "*.log");

            //string[] logFiles;

            //try
            //{
            //    logFiles = Directory.GetFiles(_watchFolder, "*.log");
            //}
            //catch (IOException)
            //{
            //    _logger.LogDebug("Skipping scan - folder is locked by NXLog.");
            //    return;
            //}

            foreach (var file in logFiles)
            {
                _logger.LogInformation($"Processing NXLog file: {file}");

                bool success = true;
                var lines = File.ReadAllLines(file);

                //string[] lines;
                //try
                //{
                //    lines = File.ReadAllLines(file);
                //}
                //catch (IOException)
                //{
                //    _logger.LogDebug($"Skipping locked file: {file}");
                //    continue;
                //}


                using var scope = _scopeFactory.CreateScope();
                var incidentService = scope.ServiceProvider.GetRequiredService<IIncidentService>();

                foreach (var line in lines)
                {
                    try
                    {
                        var evt = NxLogParser.ParseLine(line);
                        if (evt == null)
                            continue;

                        await incidentService.CreateFromNxLogAsync(evt);
                    }
                    catch (Exception ex)
                    {
                        success = false;
                        _logger.LogError(ex, $"Error processing line in file {file}");
                    }
                }

                if (success)
                {
                    File.Delete(file);
                    _logger.LogInformation($"Successfully processed and deleted NXLog file: {file}");
                }
                else
                {
                    _logger.LogWarning($"NXLog file NOT deleted due to errors: {file}");
                }
            }
        }
    }
}
