package favorites

import (
	"testing"

	"github.com/abjrcode/swervo/internal/migrations"
	"github.com/abjrcode/swervo/internal/testhelpers"
	"github.com/stretchr/testify/require"
)

func TestAddFavorite(t *testing.T) {
	db, err := migrations.NewInMemoryMigratedDatabase(t, "favorites-repo-tests.db")
	require.NoError(t, err)

	repo := NewFavorites(db)

	favorite := &Favorite{
		ProviderCode: "some-provider",
		InstanceId:   "some-nice-id",
	}

	ctx := testhelpers.NewMockAppContext()
	err = repo.Add(ctx, favorite)
	require.NoError(t, err)

	favorites, err := repo.ListAll(ctx)
	require.NoError(t, err)

	require.Len(t, favorites, 1)
	require.Equal(t, favorite, favorites[0])
}

func TestRemoveFavorite(t *testing.T) {
	db, err := migrations.NewInMemoryMigratedDatabase(t, "favorites-repo-tests.db")
	require.NoError(t, err)

	repo := NewFavorites(db)
	ctx := testhelpers.NewMockAppContext()

	favorite := &Favorite{
		ProviderCode: "some-provider",
		InstanceId:   "some-nice-id",
	}

	err = repo.Add(ctx, favorite)
	require.NoError(t, err)

	favorites, err := repo.ListAll(ctx)
	require.NoError(t, err)

	require.Len(t, favorites, 1)
	require.Equal(t, favorite, favorites[0])

	err = repo.Remove(ctx, favorite)
	require.NoError(t, err)

	favorites, err = repo.ListAll(ctx)
	require.NoError(t, err)

	require.Len(t, favorites, 0)
}

func TestIsFavorite(t *testing.T) {
	db, err := migrations.NewInMemoryMigratedDatabase(t, "favorites-repo-tests.db")
	require.NoError(t, err)

	repo := NewFavorites(db)
	ctx := testhelpers.NewMockAppContext()

	favorite := &Favorite{
		ProviderCode: "some-provider",
		InstanceId:   "some-nice-id",
	}

	err = repo.Add(ctx, favorite)
	require.NoError(t, err)

	isFavorite, err := repo.IsFavorite(ctx, favorite)
	require.NoError(t, err)
	require.True(t, isFavorite)

	isFavorite, err = repo.IsFavorite(ctx, &Favorite{
		ProviderCode: "some-provider",
		InstanceId:   "some-nice-id-2",
	})
	require.NoError(t, err)
	require.False(t, isFavorite)
}
