const db = require(".db")

const Postagens = db.sequelize.define("Postagens", {
     id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "O título não pode ser vazio."
                }
            }
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        publicationDate: {
            type: DataTypes.DATE, //! O tipo DATE armazena data e hora
            allowNull: false
        },
        tags: {
            type: DataTypes.STRING, //! Armazenaremos o array como uma string separada por vírgulas
            allowNull: true,
            get() {
                //! Getter: Transforma a string do banco de dados em um array para o código
                const rawValue = this.getDataValue('tags');
                return rawValue ? rawValue.split(',') : [];
            },
            set(value) {
                //! Setter: Transforma o array do código em uma string para salvar no banco
                if (Array.isArray(value)) {
                    this.setDataValue('tags', value.join(','));
                } else {
                    this.setDataValue('tags', value);
                }
            }
        },
        summary: {
            type: DataTypes.TEXT, //! TEXT para resumos que podem ser um pouco mais longos
            allowNull: true
        },
        content: {
            type: DataTypes.TEXT, //! TEXT é essencial para o corpo principal da postagem
            allowNull: false
        }
})