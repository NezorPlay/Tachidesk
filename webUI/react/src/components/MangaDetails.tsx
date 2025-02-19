/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { Button, createStyles, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import client from '../util/client';
import CategorySelect from './CategorySelect';

const useStyles = makeStyles(() => createStyles({
    root: {
        display: 'flex',
        flexDirection: 'row-reverse',
        '& button': {
            marginLeft: 10,
        },
    },
}));

interface IProps{
    manga: IManga
    source: ISource
}

function getSourceName(source: ISource) {
    if (source.name !== null) { return source.name; }
    return source.id;
}

export default function MangaDetails(props: IProps) {
    const classes = useStyles();
    const { manga, source } = props;
    const [inLibrary, setInLibrary] = useState<string>(
        manga.inLibrary ? 'In Library' : 'Not In Library',
    );
    const [categoryDialogOpen, setCategoryDialogOpen] = useState<boolean>(false);

    function addToLibrary() {
        setInLibrary('adding');
        client.get(`/api/v1/manga/${manga.id}/library/`).then(() => {
            setInLibrary('In Library');
        });
    }

    function removeFromLibrary() {
        setInLibrary('removing');
        client.delete(`/api/v1/manga/${manga.id}/library/`).then(() => {
            setInLibrary('Not In Library');
        });
    }

    function handleButtonClick() {
        if (inLibrary === 'Not In Library') {
            addToLibrary();
        } else {
            removeFromLibrary();
        }
    }

    return (
        <div>
            <h1>
                {manga.title}
            </h1>
            <h3>
                Source:
                {' '}
                {getSourceName(source)}
            </h3>
            <div className={classes.root}>
                <Button variant="outlined" onClick={() => handleButtonClick()}>{inLibrary}</Button>
                {inLibrary === 'In Library'
                && <Button variant="outlined" onClick={() => setCategoryDialogOpen(true)}>Edit Categories</Button>}

            </div>
            <CategorySelect
                open={categoryDialogOpen}
                setOpen={setCategoryDialogOpen}
                mangaId={manga.id}
            />
        </div>
    );
}
