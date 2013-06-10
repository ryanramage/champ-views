(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([],factory);
    } else {
        root.champ_views = factory();
    }
}(this, function () {


var views = {};

views.just_file_docs = {
    map: function(doc) {
        if (doc._attachments && doc._attachments['file.mp3']) emit(doc._id, null);
    }
}


views.all_track_assets =  {
     map: function (doc) {
        if (doc._attachments && doc._attachments['file.mp3']) emit([doc._id, 0], null);
        if (doc.musicbrainz_trackid) emit([doc.musicbrainz_trackid, 1], null);
        if (doc.type === 'rating') emit([doc.musicbrainz_trackid, 2], null);
     }
};

views.play_counts = {
    map: function(doc) {
        if (doc.type !== 'count') return;
        emit([doc.musicbrainz_trackid, doc.timestamp], null);
    },
    reduce: '_count'
};


views.albums = {
    map: function(doc) {
        if (doc.album) {
            emit(doc.album, null);
        }
    },
    reduce: '_count'
};

views.track_title_by_album = {
    map: function(doc) {
        if (doc.album && doc.musicbrainz_albumid) {

            var position = 0;
            if (doc.tracknumber) {
                position = Number(doc.tracknumber.split('/')[0]);
            }
            emit([doc.album, doc.musicbrainz_albumid, position], doc.title);
        }
    }
};


views.artists = {
    map: function(doc) {
        if (doc.artist) {
            emit(doc.artist, null);
        }
    },
    reduce: '_count'
};

views.tracks_by_artist_and_album = {
    map: function(doc) {
        if (doc.artist && doc.musicbrainz_albumid) {

            var position = 0;
            if (doc.tracknumber) {
                position = Number(doc.tracknumber.split('/')[0]);
            }
            emit([doc.artist, doc.musicbrainz_albumid, position], {title: doc.title, album: doc.album} );
        }
    }
};


views.tracks_by_rating = {
    map: function(doc) {
        if (doc.type === 'rating') {
            emit(doc.rating, null);
        }
    },
    reduce: '_count'
};

views.tracks_by_tag_and_rating = {
    map: function(doc) {
        if (doc.type === 'rating' && doc.tags && doc.tags.length) {
            for (var i = doc.tags.length - 1; i >= 0; i--) {
                emit([doc.tags[i], doc.rating], null);
            }
        }
    },
    reduce: '_count'
};


return views;


}));