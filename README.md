# Amazon Dynamo DB management tool

*Please Note: this is a __very__ work in progress.* 

## Purpose
To provide a simple GUI to view, and in the future manage, your local Dynamo DB instance.
Currectly uses the default port 8000 to connect to local Dynamo DB.

## Prerequisites

Install [Node](https://nodejs.org/)

## How to use

```
$ git clone https://github.com/RickZee/dynamodb-gui.git
$ cd dynamodb-gui
$ npm i
$ npm start
```

## Roadmap

* Add visualization to tp display *map* and *list* attribute types
* Item creating, editing, deletion
* Table modification
* Table creation and deletion
* Ability to connect to "real" Dynamo DB
* Import/Export
* Add pagination to table view
* Support AWS dynamodb query syntax in table view

## Contribute

Please create [tickets for suggestions and bugs](https://github.com/RickZee/dynamodb-gui/issues). 

Or - fork, fix and create a PR :)

## Licence

[MIT License](https://github.com/RickZee/dynamodb-gui/blob/master/LICENSE)
