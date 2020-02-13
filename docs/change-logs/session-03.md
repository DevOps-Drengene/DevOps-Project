1. Add `SSH_KEY_NAME` and `DIGITAL_OCEAN_TOKEN` to your environment.

   ```bash
   $ nano ~/.bashrc #(or whatever shell you use)
   ```
   You get your `SSH_KEY_NAME` and `DIGITAL_OCEAN_TOKEN` from the settings on cloud.digitalocean.com
   ```bash
   export SSH_KEY_NAME="My Computer SSH"
   export DIGITAL_OCEAN_TOKEN="My Secret Key"
   ```

2. Reload shell configuration after last install:

   ```bash
   $ source ~/.bashrc
   ```

3. Deploy to Digital Ocean

   ```bash
   $ vagrant up
   ```