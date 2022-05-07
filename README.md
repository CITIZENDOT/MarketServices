# Market Services (_[Video Demo](https://youtu.be/fu06r9B5IAI)_)

On our campus (IIT Patna), there are many shops rented by the administration to the private shopkeepers. The administration needs to issue licenses to the shopkeepers for a while, after which the license expires. The license can be renewed/canceled by the administration. The administration thought that it's better to ask the customers (students, people on the campus, etc...) for feedback on individual shops and shopkeepers on their service and then decide whether to extend or cancel the license.

This project aims to solve the above problem through a web app.

- Customers can rate each Shopkeeper on a scale of 1 to 5 and write remarks.
- Shop keepers can pay rent, which should be approved by the administration.
- Administration can:
  - view feedback through individual customers. (feedbacks are anonymous).
  - approve payments made by shopkeepers.
  - extend/cancel licenses.
- Above all, a delightful user experience with **Material UI**. [Check out the video demo here](https://youtu.be/fu06r9B5IAI).

## Backend

### Database Design Choices

<details><summary><b>What is the purpose of userId? Why can't we use email as <code>PRIMARY KEY</b></code></summary>

Very Valid point. Of course, we can use. `email` is a `VARCHAR(255)`, which is 255 bytes (at most). `userId` is `INT`, 4 bytes.

Since they're to be used as PRIMARY KEY, these attributes are also used in other tables. We can easily optimize the space (255 - 4) = 251 bytes, by using `userId`.

We can use the `UNIQUE` constraint on `email` to avoid repeated emails.

</details>

<details><summary><b>Why are we using <code>licenseId</code> in <code>Payments</code> and <code>Feedbacks</code> instead of <code>shopId</code>?</b></summary>

The below explanation is for the `Payments` table. But it is valid for the `Feedbacks` table too.

With `paymentDate` and `shopId` attributes, we can uniquely identify relevant shopKeeper by checking in the `Licenses` table. Identifying relevant shopKeeper is another query though. If there is no shopKeeper found, for a given (`paymentDate`, `shopId`) pair, This payment is invalid. So, we need a `BEFORE INSERT` trigger, to check if (`paymentDate`, `shopId`) pair maps to a correct license.

Instead, If we store `licenseId`, All of the above problems will be solved. There is a direct relationship between each payment to the license. `JOIN` operation with `Shops` and `Users`, We can get all details in a single query.

</details>

<details><summary><b>Why don't we have <code>feedbackId</code>/<code>paymentId</code> similar to <code>userId</code>/<code>licenseId</code></b></summary>

The reason for having `userId`/`licenseId` is, that we need to reference rows in the `Users`/`Licenses` table in other tables. To represent those rows uniquely and use less space at the same time, we chose `userId`/`licenseId` of `INT` datatype.

There are no tables that use rows from the `Feedbacks`/`Payments` table. So, `feedbackId`/`paymentId` is useless.

</details>

<details><summary><b>Why don't we have <code>feedbackId</code> similar to <code>userId</code>/<code>paymentId</code></b></summary>

Remember that, It's not necessary to have a PRIMARY KEY on a table. If we have some queries that reference a particular row, the presence of PRIMARY KEY is an advantage. In the **Feedbacks** table, We DON'T have any query which is specific to one particular feedback. Whereas in the Payments table, Consider, making a payment, approving a payment, etc... which correspond to one particular payment.

</details>

- Regarding the above question, Indices used in `Feedbacks`/`Payments` tables are well suited here, to enforce the constraints. For example, there are two payments for every license every month. There is a `UNIQUE KEY` that enforces just that.

- Same goes `Feedbacks` table. One Customer can submit feedback to one License once. The chosen PRIMARY KEY does just this.

### Relational Model

![Relational Model](./Relational%20Model.png)

### Local Development

- Setup MySQL Database.

  - Run below queries in MySQL shell as **root** user, to create the database.

  ```sql
  mysql> CREATE DATABASE MarketServices;
  mysql> CREATE USER 'MarketAdmin'@'localhost' IDENTIFIED BY 'Y@8e=nZNJgnQhC@a';
  mysql> GRANT ALL PRIVILEGES ON MarketServices.* TO 'MarketAdmin'@'localhost';
  mysql> exit;
  ```

  - Run the below command in the shell (bash/zsh), to create necessary tables.

  ```bash
  sudo mysql -u root -p MarketServices < create-database.sql
  ```

- Now that database is created, Install the necessary dependencies.

  ```bash
  yarn install
  ```

- Start Server.
  ```bash
  yarn run dev
  ```

#### Because I wanted to mention

- I asked a question on [dba.stackexchange](https://dba.stackexchange.com) regarding constraints on the `Payments` table, where I got the required answer. [Here's the question](https://dba.stackexchange.com/q/301580/236454).
