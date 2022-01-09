import Typography from '@material-ui/core/Typography';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import CollectionsGrid from '../collection/CollectionsGrid';
import { QueryClientContext } from '../QueryClientContext';

const LevelCollectionsPage = ({ selectedOptions }) => {
  const { t } = useTranslation();
  const { hooks } = useContext(QueryClientContext);

  // get all categories
  const { data: allCategories } = hooks.useCategories();

  // get category map (to map between category id and name)
  const categoriesMap = new Map(
    allCategories?.map((entry) => [entry.name, entry.id]),
  );

  const categories = selectedOptions?.filter(Boolean);
  const categoryIds = categories?.map((entry) => categoriesMap?.get(entry));
  const { data: collections, isLoading } =
    hooks.useItemsInCategories(categoryIds);
  const count = collections?.size || 0;

  return (
    <>
      <Typography variant="h3" align="center">
        {t('collectionsInCategoriesTitle', {
          array: categories,
          joinArrays: ' ,',
        })}
      </Typography>
      <Typography variant="subtitle2" aligh="left">
        {t('collectionsCount', { count })}
      </Typography>
      <CollectionsGrid collections={collections} isLoading={isLoading} />
    </>
  );
};

LevelCollectionsPage.propTypes = {
  selectedOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default LevelCollectionsPage;
