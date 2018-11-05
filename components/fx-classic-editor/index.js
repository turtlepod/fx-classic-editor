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
	TextareaControl,
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
		wp.oldEditor.remove( `editor-${ this.props.editorID }` );
	}

	initialize() {
		const { editorID } = this.props;
		let { editorSettings } = this.props;
		if ( undefined === editorSettings ) {
			editorSettings = window.wpEditorL10n.tinymce.settings;
		}

		wp.oldEditor.initialize( `editor-${ editorID }`, {
			tinymce: {
				...editorSettings,
				fixed_toolbar_container: `#toolbar-${ editorID }`,
				setup: this.onSetup,
			},
		} );
	}

	onSetup( editor, reload = false ) {
		const { editorID, editorValue, attributes } = this.props;
		const { ref } = this;

		this.editor = editor;

		// Disable TinyMCE's keyboard shortcut help.
		editor.on( 'BeforeExecCommand', ( event ) => {
			if ( event.command === 'WP_Help' ) {
				event.preventDefault();
			}
		} );

		if ( false === reload ) {
			editor.on( 'loadContent', () => editor.setContent( editorValue || '' ) );
		}

		editor.on( 'blur', () => {
			this.props.onBlur( editor.getContent() );
			return false;
		} );

		editor.addButton( 'editashtml', {
			tooltip: _x( 'Edit as HTML', 'button to expand options' ),
			icon: 'dashicon dashicons-editor-code',
			onClick: function() {
				const button = this;
				const active = ! button.active();
				button.active( active );

				// Show toggle button to go back to mce.
				document.getElementById( `toggle-${ editorID }` ).style.display = 'block';

				// Remove editor.
				wp.oldEditor.remove( `editor-${ editorID }` );

				// Add class for style.
				document.getElementById( `editor-${ editorID }` ).classList.add( 'editor-plain-text' );
			},
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
		const { editorID } = this.props;
		let { editorSettings } = this.props;
		if ( undefined === editorSettings ) {
			editorSettings = window.wpEditorL10n.tinymce.settings;
		}

		return [
			<div className="fx-classic-editor-wrap">

				<div id={ `toggle-${ editorID }` } className="fx-classic-editor-toggle" style={ { display: 'none' } }>
					<IconButton
						icon='edit'
						label={ __( 'Edit using visual editor' ) }
						onClick={ ( event ) => {
							event.stopPropagation();

							// not sure why `this.initialize` not working and need to be duplicated here.
							const { editorID } = this.props;
							let { editorSettings } = this.props;
							if ( undefined === editorSettings ) {
								editorSettings = window.wpEditorL10n.tinymce.settings;
							}

							document.getElementById( `toggle-${ editorID }` ).style.display = 'none';

							wp.oldEditor.initialize( `editor-${ editorID }`, {
								tinymce: {
									...editorSettings,
									fixed_toolbar_container: `#toolbar-${ editorID }`,
									setup: ( editor ) => {
										this.onSetup( editor, true );
										editor.on( 'loadContent', () => { return $( `editor-${ editorID }` ).val() } );
									},
								},
							} );
							event.target.blur();
						} }
					/>
				</div>

				<TextareaControl
					id={ `editor-${ editorID }` }
					onChange={ ( value ) => {
						this.props.onBlur( value );
					} }
					className="editor-plain-text"
					rows={ this.props.rows || '10' }
				/>
			</div>
		];
		/* eslint-enable jsx-a11y/no-static-element-interactions */
	}
}
