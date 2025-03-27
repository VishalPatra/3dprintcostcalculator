# 3D Print Cost Calculator

A sleek, responsive web-based calculator for estimating the cost of 3D printing projects. This professional tool helps makers and 3D printing enthusiasts calculate the total cost of a print job by considering material costs, electricity usage, failure rates, and labor costs.

![3D Print Cost Calculator](./particle.jpg)

## Features

- **Material Cost Calculation**: Calculate the cost of filament based on weight and price per kg
- **Electricity Cost Calculation**: Factor in power consumption and electricity rates
- **Risk Assessment**: Include potential failure rates in cost estimation
- **Labor Costs**: Add optional labor costs based on print time
- **Dark/Light Theme**: Toggle between light and dark mode for comfortable viewing in any environment
- **Interactive Particles**: Beautiful animated particle background that changes colors on click
- **Mobile Responsive**: Fully responsive design that works on all devices (mobile, tablet, desktop)
- **Preset Filament Types**: Quick selection of common filament types (PLA, ABS, PETG, TPU)
- **Data Persistence**: Theme preferences saved between sessions
- **Keyboard Navigation**: Full keyboard support for accessibility
- **One-Page Design**: Calculator fits within a single viewport on desktop for better UX

## Technologies Used

- Jekyll for static site generation
- HTML5/CSS3 with modern layout techniques
- JavaScript ES6+ with DOM manipulation
- Bootstrap 5 for responsive grid layout
- Particle.js for interactive background
- CSS Variables for theme switching
- Local Storage API for user preference persistence
- Responsive design with mobile-first approach

## Setup and Installation

### Local Development

1. Install [Ruby](https://www.ruby-lang.org/en/downloads/) and [Jekyll](https://jekyllrb.com/docs/installation/)
2. Clone this repository
3. Navigate to the project directory in your terminal
4. Run `bundle install` to install Ruby dependencies
5. Run `npm install` or `yarn` to install Node.js dependencies
6. Run `gulp` to compile assets and start a local server
7. Visit `http://localhost:3000` in your browser

### Deployment

This site is designed to be hosted on GitHub Pages:

1. Fork this repository
2. Update the `_config.yml` file with your information
3. Push to your GitHub repository
4. Enable GitHub Pages in your repository settings

## Customization

- Edit `_config.yml` to update site metadata
- Modify CSS in `assets/css/calculator.css` for styling changes
- Update calculator logic in `assets/js/calculator.js`
- Adjust particle effects in `assets/js/main.js`

## License

This project is licensed under the MIT License - see the LICENSE.txt file for details.

## Author

Built with ❤️ by Vishal Patra
