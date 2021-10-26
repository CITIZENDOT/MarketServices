# Backend

## Database Design

<details><summary><b>What is the purpose of userId? Why can't we use email as <code>PRIMARY KEY</b></code></summary>

Very Valid point. Ofcourse we can use. `email` is a `VARCHAR(255)`, which is 255 bytes (at most). `userId` is `INT`, 4 bytes.

Since they're to be used as PRIMARY KEY, these attributes are also used in other tables. We can easily optimize the space (255 - 4) = 251 bytes, by using `userId`.

We can use `UNIQUE` constraint on `email` to avoid repeated emails.

</details>

<details><summary><b>Why are we using <code>licenseId</code> in <code>Payments</code> and <code>Feedbacks</code> instead of <code>shopId</code>?</b></summary>

Below explanation is for `Payments` table. But it is valid for `Feedbacks` table too.

With `paymentDate` and `shopId` attributes, we can uniquely identify relevant shopKeeper by checking in `Licenses` table. Identifying relevant shopKeeper is another query though. If there is no shopKeeper found, for a given (`paymentDate`, `shopId`) pair, This payment is invalid. So, we need a `BEFORE INSERT` trigger, to check if (`paymentDate`, `shopId`) pair maps to a correct license.

Instead, If we store `licenseId`, All of the above problems will be solved. There is a direct relation for each payment to the licence. `JOIN` operation with `Shops` and `Users`, We can get all details in a single query.

</details>

<details><summary><b>Why don't we have <code>feedbackId</code>/<code>paymentId</code> similar to <code>userId</code>/<code>licenseId</code></b></summary>

The reason of having `userId`/`licenseId` is, we need to reference rows in `Users`/`Licenses` table in other tables. To represent those rows uniquely and using less space at the sametime, we chose `userId`/`licenseId` of `INT` datatype.

There are no tables which uses rows from `Feedbacks`/`Payments` table. So, `feedbackId`/`paymentId` is useless.

</details>

- Regarding above question, Indices used in `Feedbacks`/`Payments` tables are well suited here, to enforce the constraints. For example, there are two payments for every license every month. There is an `UNIQUE KEY` enforces just that.

- Same goes `Feedbacks` table. One Customer can submit a feedback to one License once. The chosen PRIMARY KEY does just this.

## Local Development

- Setup MySQL Database.

  - Run below queries in MySQL shell as **root** user, to create database.

  ```sql
  mysql> SET GLOBAL event_scheduler = ON;
  mysql> CREATE DATABASE MarketServices;
  mysql> CREATE USER 'MarketAdmin'@'localhost' IDENTIFIED BY 'Y@8e=nZNJgnQhC@a';
  mysql> GRANT ALL PRIVILEGES ON MarketServices.* TO 'MarketAdmin'@'localhost';
  mysql> exit;
  ```

  - Run below command in shell (bash/zsh), to create necessary tables.

  ```bash
  sudo mysql -u root -p MarketServices < create-database.sql
  ```

- Now that database is created, Install necessary dependencies.

  ```bash
  yarn install
  ```

- Start Server.
  ```bash
  yarn run dev
  ```

#### Because I wanted to mention

- I asked a question on [dba.stackexchange](https://dba.stackexchange.com) regarding constraints on `Payments` table, where I got required answer. [Here's the question](https://dba.stackexchange.com/q/301580/236454).
