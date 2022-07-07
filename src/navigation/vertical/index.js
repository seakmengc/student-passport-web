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
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import PolicyIcon from '@mui/icons-material/Policy';
import { OfficePerm } from 'src/perms/office';

const navigation = () => {
  const rtn = [
    // {
    //   title: 'Dashboard',
    //   icon: HomeOutline,
    //   path: '/admin',
    // },
    {
      title: 'Account Settings',
      icon: AccountCogOutline,
      path: '/admin/account-settings',
    },
  ];

  if (OfficePerm.isSuperAdmin()) {
    rtn.push(
      ...[
        {
          sectionTitle: 'Users',
        },
        {
          title: 'User List',
          icon: ViewListIcon,
          path: '/admin/users',
        },
        {
          title: 'Register',
          icon: HowToRegIcon,
          path: '/admin/users/register',
        },
      ]
    );
  }

  rtn.push(
    ...[
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
        title: 'Approval',
        icon: LibraryAddCheckIcon,
        path: '/admin/quests/approval',
      },
    ]
  );

  if (OfficePerm.isSuperAdmin()) {
    rtn.push(
      ...[
        {
          sectionTitle: 'Dev Tool',
        },
        {
          title: 'Telescope',
          icon: PolicyIcon,
          path: '/admin/telescope',
        },
      ]
    );
  }

  return rtn;
};

export default navigation;
