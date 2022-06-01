// ** Icon imports
import Login from 'mdi-material-ui/Login';
import Table from 'mdi-material-ui/Table';
import CubeOutline from 'mdi-material-ui/CubeOutline';
import HomeOutline from 'mdi-material-ui/HomeOutline';
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase';
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline';
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline';
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline';
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline';
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended';
import ViewListIcon from '@mui/icons-material/ViewList';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import ApartmentIcon from '@mui/icons-material/Apartment';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

const navigation = () => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/admin',
    },
    {
      title: 'Account Settings',
      icon: AccountCogOutline,
      path: '/account-settings',
    },
    {
      sectionTitle: 'Users',
    },
    {
      title: 'List',
      icon: ViewListIcon,
      path: '/admin/users',
    },
    {
      title: 'Register',
      icon: HowToRegIcon,
      path: '/admin/users/register',
    },
    {
      sectionTitle: 'Offices',
    },
    {
      title: 'Offices',
      icon: ApartmentIcon,
      path: '/admin/offices',
    },
    {
      title: 'Units',
      icon: LocalLibraryIcon,
      path: '/admin/units',
    },
    {
      title: 'Quests',
      icon: QuestionAnswerIcon,
      path: '/admin/quests',
    },
    {
      title: 'Approval',
      icon: LibraryAddCheckIcon,
      path: '/admin/quests/approval',
    },
    // {
    //   sectionTitle: 'Pages',
    // },
    // {
    //   title: 'Login',
    //   icon: Login,
    //   path: '/auth/login',
    //   openInNewTab: true,
    // },
    // {
    //   title: 'Register',
    //   icon: AccountPlusOutline,
    //   path: '/auth/register',
    //   openInNewTab: true,
    // },
    // {
    //   title: 'Error',
    //   icon: AlertCircleOutline,
    //   path: '/pages/error',
    //   openInNewTab: true,
    // },
    // {
    //   sectionTitle: 'User Interface',
    // },
    // {
    //   title: 'Typography',
    //   icon: FormatLetterCase,
    //   path: '/typography',
    // },
    // {
    //   title: 'Icons',
    //   path: '/icons',
    //   icon: GoogleCirclesExtended,
    // },
    // {
    //   title: 'Cards',
    //   icon: CreditCardOutline,
    //   path: '/cards',
    // },
    // {
    //   title: 'Tables',
    //   icon: Table,
    //   path: '/tables',
    // },
    // {
    //   icon: CubeOutline,
    //   title: 'Form Layouts',
    //   path: '/form-layouts',
    // },
  ];
};

export default navigation;
