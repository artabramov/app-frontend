const I18N_IGNORE = ['errors', 'months', 'sizes', 'navbar-search-input'];
const I18N =
{
    'errors': {
        'Invalid value.': 'Некорректное значение. ',
        'Already exists.': 'Уже существует. ',
        'Empty value.': 'Пустое значение. ',
        'Value not found.': 'Значение не найдено. ',
        'Value is occupied.': 'Значение уже занято. ',
        'Attempts are over.': 'Попытки исчерпаны. ',
        'Permission denied.': 'В доступе отказано. ',
        'Permission suspended.': 'Доступ приостановлен. ',
        'Permission expired.': 'Период доступа истек. ',
        'File error.': 'Файловая ошибка. ',
    },
    'months': {
        '1': 'января',
        '2': 'февраля',
        '3': 'марта',
        '4': 'апреля',
        '5': 'мая',
        '6': 'июня',
        '7': 'июля',
        '8': 'августа',
        '9': 'сентября',
        '10': 'октября',
        '11': 'ноября',
        '12': 'декабря',
    },
    'sizes': {
        '0': 'б', 
        '1': 'кб', 
        '2': 'Мб', 
        '3': 'Гб', 
        '4': 'Тб', 
        '5': 'Пб', 
        '6': 'Эб', 
        '7': 'Зб', 
        '8': 'Йб',
    },
    'navbar': {
        'users': 'Пользователи',
        'volumes': 'Хранилища',
        'categories': 'Категории',
        'reports': 'Отчеты',
        'search-submit': 'Найти',
        'register': 'Регистрация',
        'restore': 'Восстановление',
        'signin': 'Вход',
    },
    'navbar-search-input': 'поиск записей',
    'offcanvas-user-register': {
        'title': 'Регистрация',
    },
    'offcanvas-user-register-after': {
        'text-1': 'Далее используются <a href="https://ru.wikipedia.org/wiki/Time-based_One-time_Password_Algorithm">одноразовые пароли</a>. Отсканируйте это изображение с помощью приложения для аутентификации, например Google Authenticator, и сохраните свой секретный ключ.',
        'text-2': 'Если вы не можете отсканировать изображение, введите ключ вручную:',
        'text-3': 'Вход будет доступен после того, как администратор подтвердит вашу учетную запись.',
        'submit': 'Вперед',
    },
    'offcanvas-user-restore': {
        'title': 'Восстановление',
    },
    'offcanvas-user-signin': {
        'title': 'Вход',
        'text-2': 'Закончились попытки использования одноразового пароля? Используйте мастер-пароль чтобы <a id="offcanvas-user-signin-restore" href="#">восстановить их</a>.',
    },
    'offcanvas-volume-insert': {
        'title': 'Добавить хранилище',
    },

    'offcanvas-post-insert': {
        'title': 'Добавить запись',
    },

    'offcanvas-comment-insert': {
        'title': 'Добавить комментарий',
    },

    'tab-users': {
        'title': 'Пользователи',
    },

    'tab-volumes': {
        'title': 'Хранилища',
        'insert': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/></svg> Добавить хранилище',
    },

    'tab-posts': {
        'title': 'Записи',
        'insert': 'Добавить запись',
    },

    'tab-comments': {
        'title': 'Комментарии',
        'insert': 'Добавить комментарий',
    },
}