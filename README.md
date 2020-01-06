# Easally ExpressJS application
A simple ExpressJS application which runs accessibility tests against a pre-configured list of URLs. Everything runs asynchronously, so is no limit to the number of URLs which may be tested (although it may take a while).
This codebase is the result of pair programming with [easally](https://github.com/monooso/easally-cli.git).

## Installation ##
Easally uses headless Chrome for testing. Assuming you have an up-to-date version of Chrome installed, you should be good to go.

```bash
$ nvm use
$ yarn install
```

## Prerequisits

1.  ChromeDriver installed and added to the $PATH
```bash
brew cask install chromedriver
```

## Usage ##

```bash
$ cd /path/to/tableau_a11y
$ nvm use
$ npm run start
```

Once you've run the above commands, Easally will be available on `http://localhost:3000` (this is not currently configurable).

### POST /tests ###
Easally exposes a single endpoint, `POST /tests`. This endpoint accepts a JSON payload, which specifies which predefined list of URLs to test. Predefined URL lists are stored in the `/storage/urls` directory.

#### Example request ####
To test all of the URLs listed in `/storage/urls/example.txt`, make the following `POST` request to the `/tests` endpoint:

```json
{
  "filename": "example.txt"
}
```

#### Example response ####
Easally returns a JSON response, listing the URLs which are being tested. For example:

```json
{
  "urls": [
    "https://www.tableau.com",
    "https://www.tableau.com/blog",
    "https://www.tableau.com/contact"
  ]
}
```

## Test results ##
Test results are saved in the `/storage/results` directory. Each set of results is grouped in a timestamped directory. Individual test files are named using the path of the URL.

For example, given the URL `https://www.tableau.com/blog/hello-world`, the test results will be saved at `/storage/results/2019-08-28-2200/blog/hello-world.json`.

#### Troubleshooting

**Error**: Mismatch error for Chromedriver and Chrome Browser Version:

```$bash
This version of ChromeDriver only supports Chrome version XX
  (Driver info: chromedriver=xx.xxxx.xx)
```

**Solution**:

Update Chromedriver to the latest by using brew: 

`brew cask reinstall chromedriver`
