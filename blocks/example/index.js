/**
 * Block dependencies
 */
import FxClassicEditor from '../../components/fx-classic-editor';

const {
	__
} = wp.i18n;
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
							{ ...props }
							editorSettings={ {
								plugins: Editorsettings.plugins,
								toolbar1: 'bold,italic,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,unlink,wp_add_media',
								inline: false,
							} }
							editorID="testClassic1"
							attributeName="testClassic1"
						/>

						<div>
							{ __( 'Editor #2' ) }
						</div>
						<FxClassicEditor
							{ ...props }
							editorID="testClassic2"
							attributeName="testClassic2"
						/>

						<div>
							{ __( 'Editor #3' ) }
						</div>
						<FxClassicEditor
							{ ...props }
							editorSettings={ {
								plugins: Editorsettings.plugins,
								toolbar1: 'bold,italic,link,unlink',
								inline: false,
							} }
							editorID="testClassic3"
							attributeName="testClassic3"
						/>
					</div>
			]
		},
		save: function() {
			return false;
		},
	},
);