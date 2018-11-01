/**
 * f(x) Classic Editor
 *
 * Use this component to render a classic editor in your block.
 * This component is very much a clone with some additions of the `core/freeform`
 * block's edit function. Unfortunately that editor is not exposed as a reusable
 * component.
 *
 * @author    David Chandra Purnama <david.chandra@10up.com>
 * @version   1.0.0
 */

/**
 * WordPress dependencies
 */
const {
	Component,
	renderToString,
} = wp.element;

const {
	__,
	_x,
} = wp.i18n;

const {
	BlockControls,
	MediaUpload,
} = wp.editor;

const {
	IconButton,
} = wp.components;

/**
 * Internal dependencies
 */
import './editor.scss';

/**
 * f(x) Classic Editor Edit
 */
export default class fxClassicEditorEdit extends Component {
	constructor( props ) {
		super( props );
		this.initialize = this.initialize.bind( this );
		this.onSetup = this.onSetup.bind( this );
		this.focus = this.focus.bind( this );
	}

	componentDidMount() {
		const { baseURL, suffix } = window.wpEditorL10n.tinymce;

		window.tinymce.EditorManager.overrideDefaults( {
			base_url: baseURL,
			suffix,
		} );

		if ( document.readyState === 'complete' ) {
			this.initialize();
		} else {
			window.addEventListener( 'DOMContentLoaded', this.initialize );
		}
	}

	componentWillUnmount() {
		window.addEventListener( 'DOMContentLoaded', this.initialize );
		wp.oldEditor.remove( `editor-${ this.props.clientId }-${ this.props.editorID }` );
	}

	componentDidUpdate( prevProps ) {
		const { clientId, editorID, attributeName, attributes } = this.props;

		const editor = window.tinymce.get( `editor-${ clientId }-${ editorID }` );

		if ( prevProps.attributes[attributeName] !== this.props.attributes[attributeName] ) {
			editor.setContent( this.props.attributes[attributeName] || '' );
		}
	}

	initialize() {
		const { clientId, editorID } = this.props;
		let { editorSettings } = this.props;
		if ( undefined === editorSettings ) {
			editorSettings = window.wpEditorL10n.tinymce.settings;
		}

		wp.oldEditor.initialize( `editor-${ clientId }-${ editorID }`, {
			tinymce: {
				...editorSettings,
				fixed_toolbar_container: `#toolbar-${ clientId }-${ editorID }`,
				setup: this.onSetup,
			},
		} );
	}

	onSetup( editor ) {
		const { attributeName, attributes, setAttributes } = this.props;
		const { ref } = this;

		this.editor = editor;

		// Disable TinyMCE's keyboard shortcut help.
		editor.on( 'BeforeExecCommand', ( event ) => {
			if ( event.command === 'WP_Help' ) {
				event.preventDefault();
			}
		} );

		editor.on( 'loadContent', () => editor.setContent( this.props.attributes[attributeName] || '' ) );

		editor.on( 'blur', () => {
			setAttributes( {
				[ attributeName ]: editor.getContent(),
			} );
			return false;
		} );

		editor.addButton( 'kitchensink', {
			tooltip: _x( 'More', 'button to expand options' ),
			icon: 'dashicon dashicons-editor-kitchensink',
			onClick: function() {
				const button = this;
				const active = ! button.active();
				const parentEl = document.getElementById( editor.id ).parentNode;
				const toolbars = parentEl.querySelectorAll( '.mce-toolbar:not(.mce-first)' )[0];

				button.active( active );
				toolbars.style.display = ( toolbars.style.display == 'none' ) ? 'block' : 'none';
			},
		} );

		editor.addButton( 'wp_add_media', {
			tooltip: __( 'Insert Media' ),
			icon: 'dashicon dashicons-admin-media',
			onClick: function() {
				const mediaModal = window.wp.media( {
					title: __( 'Select or Upload Media' ),
					type: 'image',
				} );
				mediaModal.open();
				mediaModal.on( 'select', function(){
					const mediaAttachment = mediaModal.state().get('selection').first().toJSON();
					if ( mediaAttachment && mediaAttachment.url ) {
						window.console.log( mediaAttachment );
						const imageTag = function( { id, url, alt, width, height } ) {
							return (
								<img
									className={ `wp-image-${ id }` }
									style={ { width } }
									src={ url }
									alt={ alt }
								/>
							);
						}
						editor.execCommand( 'mceInsertContent', false, renderToString( imageTag( mediaAttachment ) ) );
					}
				});
			},
		} );

		editor.on( 'init', () => {
			const rootNode = this.editor.getBody();

			// Create the toolbar by refocussing the editor.
			if ( document.activeElement === rootNode ) {
				rootNode.blur();
				this.editor.focus();
			}
		} );
	}

	focus() {
		if ( this.editor ) {
			this.editor.focus();
		}
	}

	onToolbarKeyDown( event ) {
		event.stopPropagation();
		event.nativeEvent.stopImmediatePropagation();
	}

	render() {
		const { clientId, editorID } = this.props;
		return [
			<div className="fx-classic-editor-wrap">
				<div
					key="editor"
					id={ `editor-${ clientId }-${ editorID }` }
					className="wp-block-freeform block-library-rich-text__tinymce"
				/>
			</div>
		];
		/* eslint-enable jsx-a11y/no-static-element-interactions */
	}
}
