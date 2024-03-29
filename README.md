# Web Application for "Servicio Electrico Laser"

<p align="center">
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About the Project

The web application for "Servicio Electrico Laser", which is a company dedicated to the field of vehicle electrical systems with the aim of improving its administration. Uses the technologies demanded by the market, such as:

- Laravel is accessible, powerful, and provides tools required for large, robust applications.
- React is a JavaScript library for building user interfaces.

## Install

Clone the repository
```bash 
git clone https://github.com/rflimat/servicio-automoviles
```

### Laravel by Composer
Run this command on your cmd or terminal
```composer
composer install
```

Copy `.env.example` file to `.env` on the root folder. You can type copy `.env.example .env` if using command prompt Windows or `cp .env.example .env` if using terminal, Linux o MacOS

Run this command for sets the APP_KEy
```bash 
php artisan key:generate 
```

Run the migrations to the database
```bash 
php artisan migrate
```

Run the development server
```bash 
php artisan serve
```

Go to `http://localhost:8000/`

### Vite + React.js	
#### Yarn
Run this command on your cmd or terminal
```yarn
yarn install
```

Copy `.env.example` file to `.env.local` on the root folder for development environment, in the case for production environment, copy `.env.example` file to `.env.production`.

#### Development environment
```npm
npm run dev
```

#### Production environment
```npm
npm run build
```

## Contributing

If someone wants to add or improve something, Contact me at: [rflimat.com](https://rflimat.com)

## Security Vulnerabilities

If you discover a security vulnerability within this project, please send an e-mail to Raul Lima via [raulflimat@gmail.com](mailto:raulflimat@gmail.com). All security vulnerabilities will be promptly addressed.

## License

The project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
