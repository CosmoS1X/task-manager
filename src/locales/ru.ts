export default {
  translation: {
    appName: 'Менеджер задач',
    flash: {
      login: {
        success: 'Вы вошли в систему',
        errors: {
          email: 'Пользователь с таким email не найден',
          password: 'Неправильный пароль',
        },
      },
      logout: {
        success: 'Вы вышли из системы',
        error: 'Ошибка при выходе из системы',
      },
      users: {
        create: {
          success: 'Пользователь успешно зарегистрирован',
          error: 'Не удалось зарегистрировать',
        },
        edit: {
          success: 'Пользователь успешно изменён',
          error: 'Не удалось изменить пользователя',
          reject: 'Вы не можете редактировать другого пользователя',
        },
        delete: {
          success: 'Пользователь успешно удалён',
          error: 'Не удалось удалить пользователя',
          reject: 'Вы не можете удалять другого пользователя',
        },
      },
      statuses: {
        create: {
          success: 'Статус успешно создан',
          error: 'Не удалось создать статус',
        },
        edit: {
          success: 'Статус успешно изменён',
          error: 'Не удалось изменить статус',
        },
        delete: {
          success: 'Статус успешно удалён',
          error: 'Не удалось удалить статус',
        },
      },
      labels: {
        create: {
          success: 'Метка успешно создана',
          error: 'Не удалось создать метку',
        },
        edit: {
          success: 'Метка успешно изменена',
          error: 'Не удалось изменить метку',
        },
        delete: {
          success: 'Метка успешно удалена',
          error: 'Не удалось удалить метку',
        },
      },
    },
    navbar: {
      users: 'Пользователи',
      statuses: 'Статусы',
      labels: 'Метки',
      tasks: 'Задачи',
      login: 'Войти',
      signUp: 'Регистрация',
      logout: 'Выйти',
    },
    titles: {
      users: 'Пользователи',
      statuses: 'Статусы',
      labels: 'Метки',
      tasks: 'Задачи',
      createStatus: 'Создание статуса',
      createLabel: 'Создание метки',
      createTask: 'Создание задачи',
      editUser: 'Изменение пользователя',
      editStatus: 'Изменение статуса',
      editLabel: 'Изменение метки',
      signUp: 'Регистрация',
      login: 'Вход',
    },
    tableCols: {
      id: 'ID',
      fullName: 'Полное имя',
      email: 'Email',
      name: 'Наименование',
      status: 'Статус',
      creator: 'Автор',
      executor: 'Исполнитель',
      createdAt: 'Дата создания',
      actions: 'Действия',
    },
    buttons: {
      edit: 'Изменить',
      delete: 'Удалить',
      send: 'Отправить',
      sending: 'Отправка...',
      cancel: 'Отменить',
      createStatus: 'Создать статус',
      createLabel: 'Создать метку',
    },
    form: {
      inputs: {
        firstName: 'Имя',
        lastName: 'Фамилия',
        email: 'Email',
        password: 'Пароль',
        name: 'Наименование',
      },
      errors: {
        min_one: 'Должно быть не меньше {{count}} символа',
        min_few: 'Должно быть не меньше {{count}} символов',
        min_many: 'Должно быть не меньше {{count}} символов',
        email: {
          invalid: 'Неверный email',
          exists: 'Email уже занят',
        },
        name: {
          exists: 'Наименование уже используется',
        },
      },
    },
    errors: {
      server: 'Внутренняя ошибка сервера',
      forbidden: 'Доступ запрещен',
    },
  },
};
