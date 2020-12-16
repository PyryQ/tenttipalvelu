export const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    spacer: {
      flexGrow: 1,
    }
  }));
  const classes1 = useStyles();

  //Valmis painike fokuksen testaamiseksi
 export const BootstrapButton = withStyles({
    root: {
      boxShadow: 'none',
      textTransform: 'none',
      fontSize: 16,
      padding: '6px 12px',
      border: '1px solid',
      lineHeight: 1.5,
      backgroundColor: '#3f51b5',
      '&:hover': {
        backgroundColor: '#0069d9',
        borderColor: '#0062cc',
      },
      '&:active': {
        backgroundColor: '#0062cc',
        borderColor: '#005cbf',
      },
      '&:focus': {
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
      } 
    },
  })(Button);
  const classesButton = useStyles();