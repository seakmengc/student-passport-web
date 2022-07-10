import AccountCogOutline from 'mdi-material-ui/AccountCogOutline';
import ViewListIcon from '@mui/icons-material/ViewList';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import ApartmentIcon from '@mui/icons-material/Apartment';
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
  ];

  if (!OfficePerm.isSuperAdmin()) {
    return rtn.filter(
      (each) =>
        !(
          each.sectionTitle === 'Users' ||
          ['User List', 'Register'].includes(each.title)
        )
    );
  }

  // if (OfficePerm.isSuperAdmin()) {
  //   rtn.push(
  //     ...[
  //       {
  //         sectionTitle: 'Dev Tool',
  //       },
  //       {
  //         title: 'Telescope',
  //         icon: PolicyIcon,
  //         path: '/admin/telescope',
  //       },
  //     ]
  //   );
  // }

  return rtn;
};

export default navigation;
