class CreateImages < ActiveRecord::Migration
  def change
    create_table :images do |t|
      t.string :title
      t.string :center
      t.string :scale
      t.string :extent
      t.string :url
      t.string :description

      t.timestamps null: false
    end
  end
end
