module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        username: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notNull(value) {
                    if (value === null)
                        throw new Error('You have to enter a username');
                }
            }
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                containsAtSignAndNotNull(value) {
                    if (value === null || !value.includes('@'))
                        throw new Error('You have to enter a valid email address');
                }
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            set(value) {
                if (!value)
                    throw new Error('You have to enter a password');
                //automatic hashing upon creation
                this.setDataValue('password', require('bcrypt').hashSync(value, 10));
            },
            validate: {
                notNull(value) {
                    if (value === null)
                        throw new Error('You have to enter a password');
                }
            }
        }
    });
    return User;
}