import { makeStyles, Button, IconButton } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React, { useContext, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import { useTheme } from '@material-ui/styles';
import Seo from '../common/Seo';
import Loader from '../common/Loader';
import { APP_AUTHOR, APP_DESCRIPTION, APP_NAME } from '../../config/constants';
import Search from './Search';
import CollectionsGrid from '../collection/CollectionsGrid';
import { QueryClientContext } from '../QueryClientContext';
import { PUBLISHED_TAG_ID } from '../../config/env';
import { PLACEHOLDER_COLLECTIONS } from '../../utils/collections';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  appBarBot: {
    top: 'auto',
    bottom: 0,
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  toolbar: theme.mixins.toolbar,
  list: {
    marginTop: 20,
    marginBottom: 20,
  },
  wrapper: {
    padding: '4vw',
  },
  input: {
    marginLeft: theme.spacing(2.5),
    flex: 6,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: theme.spacing(0.5),
  },
  typographyMargin: {
    margin: theme.spacing(1.5, 0),
  },
  link: {
    textDecoration: 'none',
  },
  button: {
    marginTop: 50,
    width: drawerWidth,
  },
}));

function AllCollections() {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const [searchResults, setSearchResults] = useState(null);
  const { hooks } = useContext(QueryClientContext);
  const {
    data: collections,
    isLoading,
    isPlaceholderData,
  } = hooks.usePublicItemsWithTag(PUBLISHED_TAG_ID, {
    placeholderData: PLACEHOLDER_COLLECTIONS,
    withMemberships: true,
  });

  // get member
  const { data: members } = hooks.useMembers(
    isPlaceholderData
      ? null
      : [...new Set(collections?.map(({ creator }) => creator).toArray())],
  );

  // get all categories
  const { data: allCategories } = hooks.useCategories();

  // get category map
  const categoriesMap = new Map(
    allCategories?.map((entry) => [entry.name, entry.id]),
  );
  const { data: mathCollections } = hooks.useItemsInCategories(
    categoriesMap?.get('math'),
  );
  const mathIds = mathCollections?.map((entry) => entry.item_id).toArray();
  const collectionsMath = collections?.filter((collection) =>
    mathIds?.includes(collection.id),
  );

  const { data: litCollections } = hooks.useItemsInCategories(
    categoriesMap?.get('literature'),
  );
  const litIds = litCollections?.map((entry) => entry.item_id).toArray();
  const collectionsLiterature = collections?.filter((collection) =>
    litIds?.includes(collection.id),
  );

  const { data: nsCollections } = hooks.useItemsInCategories(
    categoriesMap?.get('natural-science'),
  );
  const nsIds = nsCollections?.map((entry) => entry.item_id).toArray();
  const collectionsNaturalScience = collections?.filter((collection) =>
    nsIds?.includes(collection.id),
  );

  const { data: ssCollections } = hooks.useItemsInCategories(
    categoriesMap?.get('social-science'),
  );
  const ssIds = ssCollections?.map((entry) => entry.item_id).toArray();
  const collectionsSocialScience = collections?.filter((collection) =>
    ssIds?.includes(collection.id),
  );

  const { data: langCollections } = hooks.useItemsInCategories(
    categoriesMap?.get('language'),
  );
  const langIds = langCollections?.map((entry) => entry.item_id).toArray();
  const collectionsLanguage = collections?.filter((collection) =>
    langIds?.includes(collection.id),
  );

  const { data: artCollections } = hooks.useItemsInCategories(
    categoriesMap?.get('art'),
  );
  const artIds = artCollections?.map((entry) => entry.item_id).toArray();
  const collectionsArt = collections?.filter((collection) =>
    artIds?.includes(collection.id),
  );

  const handleSearch = (event) => {
    const query = event.target.value.trim().toLowerCase();
    if (query.length > 0) {
      setSearchResults(
        collections.filter(
          (collection) =>
            collection.name.toLowerCase().includes(query) ||
            members
              ?.find(({ id }) => collection.creator === id)
              ?.name.toLowerCase()
              .includes(query),
        ),
      );
    }
  };

  const renderResults = () => {
    if (!searchResults) {
      return null;
    }
    return (
      <>
        <Typography variant="h3" className={classes.typographyMargin}>
          {t('Search Results')}
        </Typography>
        {searchResults.size > 0 ? (
          <CollectionsGrid collections={searchResults} />
        ) : (
          <Typography variant="body1" className={classes.typographyMargin}>
            {t('No results found.')}
          </Typography>
        )}
      </>
    );
  };

  const GOTO_LIST = [
    '/allCollections',
    '/preSchool',
    '/grade1to8',
    '/highSchool',
    '/college',
  ];

  const [sideBarStatus, setSideBarStatus] = React.useState(true);

  const closeSideBar = () => {
    setSideBarStatus(false);
  };
  const OpenSideBar = () => {
    setSideBarStatus(true);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Header />
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        open={sideBarStatus}
        anchor="left"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <div className={classes.drawerHeader}>
          <IconButton onClick={closeSideBar}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List className={classes.list}>
          {['All', 'Pre-School', 'Grade 1-8', 'High School', 'College'].map(
            (text, index) => (
              <Link href={GOTO_LIST[index]} className={classes.link}>
                <ListItem button key={text}>
                  <ListItemIcon>
                    <BookmarkIcon />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              </Link>
            ),
          )}
        </List>
        <Divider />
        <List className={classes.list}>
          {['Test Prep', 'Post Grad'].map((text) => (
            <ListItem button key={text} disabled>
              <ListItemIcon>
                <BookmarkIcon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <a href="https://graasp.eu">
          <Button variant="contained" className={classes.button}>
            Create Your Own
          </Button>
        </a>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: sideBarStatus,
        })}
      >
        <IconButton
          color="primary"
          aria-label="open menu"
          onClick={OpenSideBar}
        >
          <MenuOpenIcon />
        </IconButton>
        <Typography variant="body1" display="inline">
          Open Menu
        </Typography>
        <Seo
          title={APP_NAME}
          description={APP_DESCRIPTION}
          author={APP_AUTHOR}
        />
        <div style={{ marginLeft: 50 }}>
          <Typography variant="h3" align="center">
            {t('Graasp Collections Directory')}
          </Typography>
          <Search handleSearch={handleSearch} isLoading={isLoading} />
          {isLoading ? <Loader /> : renderResults()}
          <Typography variant="h3" className={classes.typographyMargin}>
            {t('Math')}
          </Typography>
          <CollectionsGrid
            collections={collectionsMath}
            isLoading={isLoading}
          />
          <Typography variant="h3" className={classes.typographyMargin}>
            {t('Literature')}
          </Typography>
          <CollectionsGrid
            collections={collectionsLiterature}
            isLoading={isLoading}
          />
          <Typography variant="h3" className={classes.typographyMargin}>
            {t('Language')}
          </Typography>
          <CollectionsGrid
            collections={collectionsLanguage}
            isLoading={isLoading}
          />
          <Typography variant="h3" className={classes.typographyMargin}>
            {t('Natural Science')}
          </Typography>
          <CollectionsGrid
            collections={collectionsNaturalScience}
            isLoading={isLoading}
          />
          <Typography variant="h3" className={classes.typographyMargin}>
            {t('Social Science')}
          </Typography>
          <CollectionsGrid
            collections={collectionsSocialScience}
            isLoading={isLoading}
          />
          <Typography variant="h3" className={classes.typographyMargin}>
            {t('Art')}
          </Typography>
          <CollectionsGrid collections={collectionsArt} isLoading={isLoading} />
          <Typography variant="h3" className={classes.typographyMargin}>
            {t('All')}
          </Typography>
          <CollectionsGrid collections={collections} isLoading={isLoading} />
        </div>
      </main>
      <AppBar position="fixed" color="primary" className={classes.appBarBot}>
        <Footer />
      </AppBar>
    </div>
  );
}

export default AllCollections;
