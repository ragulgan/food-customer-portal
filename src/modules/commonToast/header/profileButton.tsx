import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import profile from '../../../assets/images/profile.webp'
import profileMenu from '../../../assets/images/profileMenu.svg'
import order from '../../../assets/images/orderImg.svg'
import offer from '../../../assets/images/offerImg.svg'
import logout from '../../../assets/images/logoutImg.svg'
import { useNavigate } from 'react-router-dom';
import { en, Gallery_BASE_URL, StaticData } from '../../../config';
import { Tooltip } from '@mui/material';
import Swal from 'sweetalert2';
import avatar from '../../../assets/images/profile.webp';

interface ConfirmationModalProps {
  name: any;
  image: any;
}

const ProfileMenu: React.FC<ConfirmationModalProps> = ({ name, image }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate()
  const lang = sessionStorage.getItem("LANG")
  const staticData = StaticData()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate('/orderPage')
    setAnchorEl(null);
  }

  const handleOrder = () => {
    navigate('/orderPage', {state: 0})
    setAnchorEl(null);
  }

  const handleLogout = () => {
    setAnchorEl(null);
    Swal.fire({
      html: `<div dir=${lang === en ? "rtl":"ltr"} class=${lang === en ? "":"reem-kulfi"}>${image && image.length > 10 ? `<img src="${Gallery_BASE_URL}${image}" class="log-out-img" alt="User Image" />` : `<img src="${avatar}" class="log-out-img" alt="User Image" />`}<p class=${lang === en ? "":"reem-kulfi"} style="font-size: 24px; font-weight:600;">${name}</p><div>${lang === en ? staticData?.logoutConfirmation:"Do you want to log out?"}</div></div>`,
      showCancelButton: true,
      confirmButtonText: `${lang === en ? staticData?.yes:"Yes"}`,
      cancelButtonText: `${lang === en ? staticData?.noCancel!:'No, cancel!'}`,
      confirmButtonColor: "#FB640A",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem('AUTH_TOKEN');
        sessionStorage.removeItem('Number');
        sessionStorage.removeItem('FCM');
        sessionStorage.removeItem("demo");
        sessionStorage.removeItem("LOCATION")
        sessionStorage.removeItem("Lat");
        sessionStorage.removeItem("Long")
        navigate('/homepage');
        window.location.reload();
      }
    });
  };
  
  return (
    <>
      <Tooltip title={name} followCursor>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          className='reem-kulfi profile-button'
          sx={{ width:'100%'}}
        >
          {image ? (
            <>
              <img
                src={`${Gallery_BASE_URL}${image}`}
                width='31'
                height='31'
                alt="Profile picture"
                style={{ borderRadius: '50%', objectFit: 'cover' }}
                loading='lazy'
              />
              {name === null ?
                <span style={{ marginLeft: '6px' }}>My Name</span> :
                <span style={{ marginLeft: '6px', overflow: 'hidden', whiteSpace: 'nowrap',textOverflow: 'ellipsis' }}>{name}</span>
              }
            </>
          ) : (
            <>
              <img
                src={profile}
                width={31}
                height={31}
                alt="Profile picture"
                style={{ borderRadius: '50%', objectFit: 'cover' }}
                loading='lazy'
              />
              {name === null ?
                <span style={{ marginLeft: '6px' }}>My Name</span> :
                <span style={{ marginLeft: '6px', overflow: 'hidden', whiteSpace: 'nowrap',textOverflow: 'ellipsis' }}>{name}</span>
              }
            </>
          )}
        </Button>
      </Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        sx={{p:3}}
        className='profile-dropdown'
        dir={lang === en ? "rtl":"ltr"}
      >
        <MenuItem onClick={handleProfile} sx={{width:'190px', my:1}}>
            <img src={profileMenu} alt="Profile Image" loading='lazy'/>
            <span style={lang === en ? {marginRight:'12px'}:{marginLeft:'12px'}}>{lang === en ? staticData?.menuProfile : "Profile"}</span>
        </MenuItem>
        <MenuItem onClick={handleOrder} sx={{width:'190px', my:1}}>
            <img src={order} alt="Profile Image" loading='lazy'/>
            <span style={lang === en ? {marginRight:'12px'}:{marginLeft:'12px'}}>{lang === en ? staticData?.menuOrder : "My Order"}</span>
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{width:'190px', my:1}}>
            <img src={logout} alt="Profile Image" loading='lazy'/>
            <span style={lang === en ? {marginRight:'12px'}:{marginLeft:'12px'}}>{lang === en ? staticData?.menuLogout : "Logout"}</span>
        </MenuItem>
      </Menu>
    </>
  );
}

export default ProfileMenu