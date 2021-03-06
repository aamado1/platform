// Copyright (c) 2016 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import $ from 'jquery';
import ReactDOM from 'react-dom';
import Constants from 'utils/constants.jsx';
import FileInfoPreview from './file_info_preview.jsx';
import * as Utils from 'utils/utils.jsx';

import React from 'react';

export default class AudioVideoPreview extends React.Component {
    constructor(props) {
        super(props);

        this.handleFileInfoChanged = this.handleFileInfoChanged.bind(this);
        this.handleLoadError = this.handleLoadError.bind(this);

        this.stop = this.stop.bind(this);

        this.state = {
            canPlay: true
        };
    }

    componentWillMount() {
        this.handleFileInfoChanged(this.props.fileInfo);
    }

    componentDidMount() {
        if (this.refs.source) {
            $(ReactDOM.findDOMNode(this.refs.source)).one('error', this.handleLoadError);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.fileUrl !== nextProps.fileUrl) {
            this.handleFileInfoChanged(nextProps.fileInfo);
        }
    }

    handleFileInfoChanged(fileInfo) {
        let video = ReactDOM.findDOMNode(this.refs.video);
        if (!video) {
            video = document.createElement('video');
        }

        const canPlayType = video.canPlayType(fileInfo.mime_type);

        this.setState({
            canPlay: canPlayType === 'probably' || canPlayType === 'maybe'
        });
    }

    componentDidUpdate() {
        if (this.refs.source) {
            $(ReactDOM.findDOMNode(this.refs.source)).one('error', this.handleLoadError);
        }
    }

    handleLoadError() {
        this.setState({
            canPlay: false
        });
    }

    stop() {
        if (this.refs.video) {
            const video = ReactDOM.findDOMNode(this.refs.video);
            video.pause();
            video.currentTime = 0;
        }
    }

    render() {
        if (!this.state.canPlay) {
            return (
                <FileInfoPreview
                    fileInfo={this.props.fileInfo}
                    fileUrl={this.props.fileUrl}
                />
            );
        }

        let width = Constants.WEB_VIDEO_WIDTH;
        let height = Constants.WEB_VIDEO_HEIGHT;
        if (Utils.isMobile()) {
            width = Constants.MOBILE_VIDEO_WIDTH;
            height = Constants.MOBILE_VIDEO_HEIGHT;
        }

        // add a key to the video to prevent React from using an old video source while a new one is loading
        return (
            <video
                key={this.props.fileInfo.id}
                ref='video'
                data-setup='{}'
                controls='controls'
                width={width}
                height={height}
            >
                <source
                    ref='source'
                    src={this.props.fileUrl}
                />
            </video>
        );
    }
}

AudioVideoPreview.propTypes = {
    fileInfo: React.PropTypes.object.isRequired,
    fileUrl: React.PropTypes.string.isRequired
};
