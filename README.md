# Time Series Analysis App

This project visualizes historical and predicted time series data using React and Recharts. Users can view the data in different time frames (daily, monthly, yearly) with an interactive chart interface.

## Features

- **Time Series Visualization**: View historical and predicted data.
- **Adjustable Views**: Toggle between daily, monthly, and yearly views.
- **Data Refresh**: Fetches updated data every 5 minutes or manually refresh.
- **Custom Tooltips**: Displays detailed date and value information on hover.
- **Component Integration**: Integrates custom components like `ViewSelector` and `StickChart`.

## Technologies Used

- React
- Recharts for charting
- Axios for API calls
- Lucide Icons for UI elements
- TypeScript for type assurance

## Components

1. **App**: Main component that handles data fetching and state management.
2. **ViewSelector**: Allows users to switch between different view modes.
3. **StickChart**: Renders yearly data specifically.
4. **CustomTooltip** (`Recharts Tooltip`): Displays additional data information on chart hover.

## Getting Started

### Prerequisites

Ensure you have the latest versions of Node.js and npm installed on your machine.

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/timeseries-analysis-app.git

2. **ViewSelector**: Allows users to switch between different view modes.
3. **StickChart**: Renders yearly data specifically.
4. **CustomTooltip** (`Recharts Tooltip`): Displays additional data information on chart hover.

## Getting Started

### Prerequisites

Ensure you have the latest versions of Node.js and npm installed on your machine.

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/timeseries-analysis-app.git
   ```

2. Navigate into the project directory:
   ```bash
   cd timeseries-analysis-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server and run the app locally:

```bash
npm start
```

The application will be running at [http://localhost:3000](http://localhost:3000).

### Data Source

The data is fetched from an external API:
- URL: `https://b861-88-198-67-119.ngrok-free.app/predict`

Ensure that the endpoint is reachable and active when running the application.

## Customization

Feel free to customize styles and components by editing the respective files within the `components`, `styles`, or `utils` directories. Make sure to update types in the `types` directory if you extend data structures in the app.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or issue if you discover any problems or have suggestions for improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the creators of [Recharts](https://recharts.org/) and [Lucide](https://lucide.dev/) for their powerful tools.
- Inspired by various open-source visualization projects.



