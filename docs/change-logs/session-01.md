# Session 01

1. Install *Anaconda* (Python distribution):

   ```bash
   $ wget https://repo.anaconda.com/archive/Anaconda3-2019.10-Linux-x86_64.sh
   $ bash ~/Downloads/Anaconda3-2019.10-Linux-x86_64.sh
   ```

   And follow the installation guide.

2. Reload shell configuration after last install:

   ```bash
   $ source ~/.bashrc
   ```

3. Check that *SQLite3* was included the installation of *Anaconda*:

   ```bash
   $ sqlite3 --version
   ```

   It should give a output like this:
   `3.30.0 2019-10-04 15:03:17 c20a35336432025445f9f7e289d0cc3e4003fb17f45a4ce74c6269c407c6e09f`

4. Check that the C compiler, *gcc*, is installed:

   ```bash
   $ gcc --version
   ```

   It should give a output like this:

   ```bash
   gcc (Ubuntu 7.4.0-1ubuntu1~18.04.1) 7.4.0
   Copyright (C) 2017 Free Software Foundation, Inc.
   This is free software; see the source for copying conditions.  There is NO
   warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
   ```

   If it is not installed, you can download and install it via the apt-repository with the following command:

   ```bash
   $ sudo apt-get install gcc
   ```

5. Install *SQLite3* library for C program:

   ```bash
   $ sudo apt-get install libsqlite3-dev
   ```

6. Install code editor of your choice

7. Install *DB Browser for SQLite*

   ```bash
   $ sudo apt install sqlitebrowser
   ```

8. Run *2to3* tool to translate Python 2 code to Python 3 equivalent:

   ```bash
   $ 2to3 -o . -n -w --add-suffix=3 minitwit.py
   ```

   Check if changes are okay with the following command:

   ```bash
   $ diff minitwit.py minitwit.py3
   ```

   If so, replace `minitwit.py` with contents of the generated file, `minitwit.py3`, and remove the now unused generated file with the following command:

   ```bash
   $ cat minitwit.py3 | tee minitwit.py && rm minitwit.py3
   ```

9. Fix decoding of DB-file into utf-8 when running `minitwit.py`:

   ```bash
   # init_db()
   -            db.cursor().executescript(f.read())
   +            db.cursor().executescript(f.read().decode('utf-8'))
   ```

10. Install shellcheck:

    ```bash
    $ sudo apt install shellcheck
    ```

11. Run shellcheck tool on `control.sh`:
    List recommeded changes by running the following command:

    ```bash
    $ shellcheck control.sh
    ```

    Apply recommended fixes to `control.sh` in editor.

12. Initialize DB and start application:

    ```bash
    $ make init
    $ ./control.sh start
    ```

