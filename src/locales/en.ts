export default {
  translation: {
    appName: 'Task Manager',
    flash: {
      login: {
        success: 'You are logged in',
        errors: {
          email: 'User with this email not found',
          password: 'Incorrect password',
        },
      },
      logout: {
        success: 'You are logged out',
        error: 'Logout error',
      },
      users: {
        create: {
          success: 'User registered successfully',
          error: 'Failed to register',
        },
        edit: {
          success: 'User edited successfully',
          error: 'Failed to edit',
          reject: 'You cannot edit another user',
        },
        delete: {
          success: 'User deleted successfully',
          error: 'Failed to delete',
          reject: 'You cannot delete another user',
        },
      },
    },
    navbar: {
      users: 'Users',
      statuses: 'Statuses',
      labels: 'Labels',
      tasks: 'Tasks',
      login: 'Login',
      signUp: 'Sign-up',
      logout: 'Logout',
    },
    titles: {
      users: 'Users',
      statuses: 'Statuses',
      labels: 'Labels',
      tasks: 'Tasks',
      createStatus: 'Status creation',
      createLabel: 'Label creation',
      createTask: 'Task creation',
      editUser: 'Edit user',
      editStatus: 'Edit status',
      editLabel: 'Edit label',
      signUp: 'Sign-up',
      login: 'Login',
    },
    tableCols: {
      id: 'ID',
      fullName: 'Full name',
      email: 'Email',
      name: 'Name',
      status: 'Status',
      creator: 'Author',
      executor: 'Executor',
      createdAt: 'Created at',
      actions: 'Actions',
    },
    buttons: {
      edit: 'Edit',
      delete: 'Delete',
      send: 'Send',
      sending: 'Sending...',
    },
    form: {
      inputs: {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        password: 'Password',
      },
      errors: {
        min_one: 'Must be at least {{count}} character',
        min_other: 'Must be at least {{count}} characters',
        email: {
          invalid: 'Invalid email',
          exists: 'Email is already exists',
        },
      },
    },
    errors: {
      server: 'Internal server error',
      forbidden: 'Access denied',
    },
  },
};
