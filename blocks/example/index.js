/**
 * Block dependencies
 */
import FxClassicEditor from '../../components/fx-classic-editor';

const {
	__,
} = wp.i18n;
const {
	RawHTML,
} = wp.element;
const {
	registerBlockType
} = wp.blocks;

/**
 * Register block
 */
export default registerBlockType(
	'fx-classic-editor/example',
	{
		title: __( 'f(x) Classic Editor Control Example' ),
		description: __( 'This is a test blocks.' ),
		category: 'common',
		icon: 'edit',
		keywords: [],
		attributes: {
			testClassic1: {
				type: 'string',
			},
			testClassic2: {
				type: 'string',
			},
			testClassic3: {
				type: 'string',
			},
		},
		edit: props => {
			const { attributes: {testClassic1, testClassic2, testClassic3} } = props;
			const Editorsettings = window.wpEditorL10n.tinymce.settings;

			return [
					<div className="my-blocks">
						<div>
							{ __( 'Editor #1' ) }
						</div>
						<FxClassicEditor
							editorSettings={ {
								plugins: Editorsettings.plugins,
								toolbar1: 'editashtml,bold,italic,link,unlink',
								inline: false,
							} }
							editorValue= { testClassic1 }
							onBlur={ ( value ) => {
								props.setAttributes( { testClassic1: value } )
							} }
							editorID={ `${ props.clientId }-testClassic1` }
							rows='4'
						/>

						<div>
							{ __( 'Editor #2' ) }
						</div>
						<FxClassicEditor
							editorID={ `${ props.clientId }-testClassic2` }
							editorValue= { testClassic2 }
							onBlur={ ( value ) => props.setAttributes( { testClassic2: value } ) }
						/>

						<div>
							{ __( 'Editor #3' ) }
						</div>
						<FxClassicEditor
							editorSettings={ {
								plugins: Editorsettings.plugins,
								toolbar1: 'editashtml,bold,italic,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,unlink,wp_add_media',
								inline: false,
							} }
							editorValue= { testClassic3 }
							onBlur={ ( value ) => props.setAttributes( { testClassic3: value } ) }
							editorID={ `${ props.clientId }-testClassic3` }
						/>
					</div>
			]
		},
		save( { attributes } ) {
			const { testClassic1,testClassic2,testClassic3 } = attributes;
			return (
				<div>
					<h3>{ __( 'Editor #1' ) }</h3>
					<RawHTML>{ testClassic1 }</RawHTML>
					<h3>{ __( 'Editor #2' ) }</h3>
					<RawHTML>{ testClassic2 }</RawHTML>
					<h3>{ __( 'Editor #3' ) }</h3>
					<RawHTML>{ testClassic3 }</RawHTML>
				</div>
			);
		},
	},
);