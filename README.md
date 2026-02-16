# ioBroker Prometheus Exporter

A lightweight Prometheus exporter for ioBroker that automatically discovers and exports all numeric states as metrics with smart pattern-based grouping and metadata enrichment.

## Features

- 🔄 **Auto-Discovery**: Automatically exports all numeric states from ioBroker
- 🏷️ **Smart Labeling**: Enriches metrics with object names, locations, and room information
- 🎯 **Pattern-Based Grouping**: Unified metric names for SmartOffice, Zigbee, and system adapters
- 📊 **Metadata Caching**: Fetches object metadata once for better performance
- 🐳 **Docker Ready**: Pre-built Docker images available via GitHub Container Registry
- 🔧 **TypeScript**: Fully typed with TypeScript for reliability

## Supported Patterns

### Zigbee Devices
```
zigbee.[instance].[device_id].[value]
→ iobroker_zigbee_temperature{instance="0",device_id="...",device_name="..."}
```

### System Adapters
```
system.adapter.[adapter].[instance].[value]
→ iobroker_system_adapter_alive{adapter="rest-api",instance="0"}
```

### System Host
```
system.host.[hostname].[value]
→ iobroker_system_host_uptime{hostname="..."}
```

### Generic Adapters
```
[adapter].[instance].[value]
→ iobroker_backitup_info_iobrokernexttime{adapter="backitup",instance="0"}
```

## Quick Start

### Docker Compose
```yaml
services:
  iobroker-exporter:
    image: ghcr.io/trqb3/iobroker-exporter:latest
    container_name: iobroker-exporter
    restart: unless-stopped
    environment:
      - IOBROKER_HOST=172.16.30.2
      - REST_API_PORT=8093
      - EXPORTER_PORT=9202
      - SCRAPE_INTERVAL=30s
    ports:
      - "9202:9202"
```

### Prometheus Configuration
```yaml
scrape_configs:
  - job_name: 'iobroker'
    scrape_interval: 30s
    static_configs:
      - targets: ['iobroker-exporter:9202']
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `IOBROKER_HOST` | ioBroker host address | `localhost` |
| `REST_API_PORT` | ioBroker REST API port | `8093` |
| `EXPORTER_PORT` | Prometheus exporter port | `9202` |
| `SCRAPE_INTERVAL` | Interval for fetching states | `30s` |

### ioBroker Requirements

- **REST API Adapter** must be installed and running
- API should be accessible from the exporter (e.g., `http://172.16.30.2:8093`)

## Development

### Prerequisites

- Node.js 24+
- npm

### Setup
```bash
# Clone repository
git clone https://github.com/trqb3/iobroker-exporter.git
cd iobroker-exporter

# Install dependencies
npm i 

# Build
npm run build

# Run locally
npm start
```

### Development Mode
```bash
npm run dev
```

### Build Docker Image
```bash
docker build -t iobroker-exporter:latest .
```

## Example Metrics
```prometheus
iobroker_zigbee_temperature{instance="0",device_id="0x00158d0001a2b3c4",device_name="Living Room Sensor"} 22.3
iobroker_system_adapter_alive{adapter="rest-api",instance="0",name="rest-api.0 alive"} 1
iobroker_backitup_info_iobrokernexttime{adapter="backitup",instance="0",name="Next iobroker backup"} 1740067200
```

## Grafana Queries

### Temperature by Room
```promql
smartoffice_sensor_temperature{room="Tischgruppe 1"}
```

### All Zigbee Devices
```promql
iobroker_zigbee_{instance="0"}
```

### Adapter Status
```promql
iobroker_system_adapter_alive{adapter="rest-api"}
```

## Label Filtering

Empty or undefined labels are automatically filtered out from metrics to keep them clean.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

Created by **Trqb3**

## Contributing

Contributions are welcome! Please open an issue or pull request.